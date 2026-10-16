import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { createWorkdayEntry, getWorkdayEntries, getWorkdayCatalog } from "../../../utils/auth";
import s from "./UserCabinet.module.scss";

const getToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const emptyRow = () => ({ product: '', process: '', quantity: '' });
const isEmptyRow = row => !row.product && !row.process && !row.quantity;
const validationSchema = Yup.object({
  date: Yup.string().required('Оберіть дату').test('past-date', 'Дата не може бути в майбутньому', value => value && value <= getToday()),
  hoursWorked: Yup.number().typeError('Введіть години').moreThan(0, 'Вкажіть більше 0 год').max(24, 'Максимум 24 год').required('Введіть години'),
  rows: Yup.array().test('process-rows', 'Заповніть продукт, процес та додатну цілу кількість у кожному рядку.', rows => {
    const filled = rows.filter(row => !isEmptyRow(row));
    return filled.length > 0 && filled.length <= 100 && filled.every(row => row.product && row.process && Number.isInteger(Number(row.quantity)) && Number(row.quantity) > 0 && Number(row.quantity) <= 100000);
  }),
});

const WorkdayEntry = ({ onSaved }) => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [catalog, setCatalog] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [success, setSuccess] = useState('');
  const [retry, setRetry] = useState(0);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const saving = useRef(false);

  useEffect(() => {
    let active = true;
    setLoadError('');
    Promise.all([getWorkdayEntries(), getWorkdayCatalog()]).then(([data, options]) => {
      if (active) { setEntries(data); setCatalog(options); }
    }).catch(error => { if (active) setLoadError(error.response?.data?.message || 'Не вдалося завантажити записи та норми процесів.'); });
    return () => { active = false; };
  }, [retry]);

  useEffect(() => {
    if (!open) return;
    const button = trigger.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => { document.body.style.overflow = overflow; button?.focus(); };
  }, [open]);

  const handleSubmit = async values => {
    saving.current = true;
    setSaveError('');
    try {
      const entry = await createWorkdayEntry({ ...values, hoursWorked: Number(values.hoursWorked), rows: values.rows.filter(row => !isEmptyRow(row)).map(row => ({ ...row, quantity: Number(row.quantity) })) });
      setEntries(previous => [entry, ...previous.filter(item => item.date !== entry.date)].sort((a, b) => b.date.localeCompare(a.date)));
      setSuccess('Дані збережено. Години та ефективність у табелі оновлено.');
      setOpen(false);
      onSaved();
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Не вдалося зберегти дані. Спробуйте ще раз.');
    } finally { saving.current = false; }
  };

  return (
    <section className={s.card} aria-labelledby="workday-title">
      <div className={s.cardHeading}><div><span className={s.sectionLabel}>ОБЛІК РОБОЧОГО ДНЯ</span><h2 id="workday-title">Дані за робочий день</h2></div><button ref={trigger} type="button" className={s.saveButton} disabled={!catalog || Boolean(loadError)} onClick={() => { setSaveError(''); setSuccess(''); setOpen(true); }}>Ввести дані за робочий день</button></div>
      {success && <p className={s.success} role="status">{success}</p>}
      {loadError && <p className={s.error} role="alert">{loadError}<button className={s.retry} onClick={() => setRetry(value => value + 1)}>Повторити</button></p>}
      {entries.length > 0 ? <div className={s.tableWrapper}><table className={s.entriesTable}><thead><tr><th>Дата</th><th>Години</th><th>Процесів</th><th>Нормативні хв</th><th>Ефективність</th></tr></thead><tbody>{entries.map(entry => <tr key={entry.id}><td>{entry.date.split('-').reverse().join('.')}</td><td>{entry.hoursWorked}</td><td>{entry.rows.length}</td><td>{entry.totalNormMinutes}</td><td>{entry.efficiency}%</td></tr>)}</tbody></table></div> : !loadError && <p className={s.hint}>Додайте продукти й процеси за робочий день.</p>}
      {open && <dialog ref={dialog} className={`${s.workdayDialog} ${s.wideWorkdayDialog}`} aria-labelledby="workday-dialog-title" onCancel={event => { event.preventDefault(); if (!saving.current) setOpen(false); }} onClick={event => { if (event.target === dialog.current && !saving.current) setOpen(false); }}>
        <div className={s.workdayDialogBody}>
          <span className={s.sectionLabel}>РОБОЧИЙ ДЕНЬ</span><h2 id="workday-dialog-title">Ввести дані</h2>
          <Formik initialValues={{ date: getToday(), hoursWorked: 8, rows: [emptyRow()] }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, isSubmitting, setFieldValue }) => {
              const totalMinutes = values.rows.reduce((sum, row) => sum + (catalog.processes.find(item => item.id === row.process)?.normMinutes || 0) * (Number(row.quantity) || 0), 0);
              const productiveMinutes = Number(values.hoursWorked) * 60;
              const efficiency = productiveMinutes > 0 ? Math.round(totalMinutes / productiveMinutes * 10000) / 100 : null;
              return <Form className={s.workdayForm} onKeyDown={event => { if (event.key === 'Enter' && event.target.tagName === 'INPUT' && !event.nativeEvent.isComposing) event.preventDefault(); }}>
                <div className={s.workdayTop}>
                  <div className={s.field}><label htmlFor="workday-date">Дата</label><Field id="workday-date" name="date" type="date" max={getToday()} /><ErrorMessage name="date" component="p" className={s.error} /></div>
                  <div className={s.field}><label htmlFor="workday-hours">Відпрацьовано годин</label><Field id="workday-hours" name="hoursWorked" type="number" min="0.01" max="24" step="0.01" /><ErrorMessage name="hoursWorked" component="p" className={s.error} /></div>
                  <div className={s.efficiencyPreview} aria-live="polite"><span>Ефективність</span><strong>{efficiency === null ? '—' : `${efficiency}%`}</strong><small>{totalMinutes} нормативних хв / {Math.max(0, Math.round(productiveMinutes * 100) / 100)} робочих хв</small></div>
                </div>
                <p className={s.hint}>Ефективність = нормативні хвилини ÷ (відпрацьовані години × 60) × 100%. 8 годин і 480 нормативних хвилин = 100%. Норми завантажено з API. Повторне підтвердження дати замінює попередній звіт за цей день.</p>
                <FieldArray name="rows">{({ push, remove }) => <div className={s.processRows}>
                  <div className={s.processHeader}><span>Продукт</span><span>Процес</span><span>Кількість</span><span>Час, хв/шт</span><span>Загальний час, хв</span><span /></div>
                  {values.rows.map((row, index) => {
                    const norm = catalog.processes.find(item => item.id === row.process)?.normMinutes || 0;
                    return <div className={s.processRow} key={index}>
                      <div className={s.field}><label className={s.srOnly} htmlFor={`product-${index}`}>Продукт, рядок {index + 1}</label><Field as="select" id={`product-${index}`} name={`rows.${index}.product`}><option value="">Продукт</option>{catalog.products.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Field></div>
                      <div className={s.field}><label className={s.srOnly} htmlFor={`process-${index}`}>Процес, рядок {index + 1}</label><Field as="select" id={`process-${index}`} name={`rows.${index}.process`} onChange={event => { setFieldValue(`rows.${index}.process`, event.target.value); if (event.target.value && index === values.rows.length - 1 && values.rows.length < 100) push(emptyRow()); }}><option value="">Процес</option>{catalog.processes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Field></div>
                      <div className={s.field}><label className={s.srOnly} htmlFor={`quantity-${index}`}>Кількість, рядок {index + 1}</label><Field id={`quantity-${index}`} name={`rows.${index}.quantity`} type="number" min="1" max="100000" step="1" placeholder="0" /></div>
                      <output className={s.normValue} aria-label={`Норма, рядок ${index + 1}`}>{row.process ? norm : '—'}</output>
                      <output className={s.normValue} aria-label={`Загальний час, рядок ${index + 1}`}>{row.process && row.quantity ? norm * Number(row.quantity) : '—'}</output>
                      <button type="button" className={s.removeRow} disabled={values.rows.length === 1} onClick={() => remove(index)} aria-label={`Видалити рядок ${index + 1}`}>✕</button>
                    </div>;
                  })}
                  <ErrorMessage name="rows" component="p" className={s.error} />
                </div>}</FieldArray>
                {saveError && <p className={s.error} role="alert">{saveError}</p>}
                <div className={s.workdayActions}><button className={s.saveButton} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Збереження…' : 'Підтвердити'}</button><button className={s.cancelButton} type="button" disabled={isSubmitting} onClick={() => setOpen(false)}>Скасувати</button></div>
              </Form>;
            }}
          </Formik>
        </div>
      </dialog>}
    </section>
  );
};

WorkdayEntry.propTypes = { onSaved: PropTypes.func.isRequired };
export default WorkdayEntry;