import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SectionImages from "./SectionImages";
import s from "./UserCabinet.module.scss";

const documents = { 'РПС': 'РПС.PDF', 'Жилеты': 'Жилет.PDF', 'Повязки': 'Повязка.PDF', 'Halo': 'Halo.PDF' };

const CategoryMedia = ({ category }) => {
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const file = documents[category];
  const source = file ? `/${encodeURIComponent(file)}` : '';
  const label = category;

  useEffect(() => {
    if (!expanded) return;
    const triggerButton = trigger.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => { document.body.style.overflow = previousOverflow; triggerButton?.focus(); };
  }, [expanded]);

  return (
    <section className={s.card}>
      <span className={s.sectionLabel}>НАПРЯМКИ / {label.toUpperCase()}</span><h2>{label}</h2><SectionImages category={category} />
      {file ? <>
        <div className={s.mediaHeading}><p className={s.hint}>Матеріали «{category}». Натисніть «Збільшити» для детального перегляду.</p><button ref={trigger} type="button" className={s.saveButton} onClick={() => setExpanded(true)}>Збільшити ↗</button></div>
        <object className={s.documentPreview} data={`${source}#view=FitH`} type="application/pdf" aria-label={`Матеріали ${category}`}><p className={s.hint}>Браузер не підтримує перегляд PDF. <a href={source} target="_blank" rel="noreferrer">Відкрити файл</a></p></object>
        <a className={s.documentLink} href={source} target="_blank" rel="noreferrer">Відкрити оригінал PDF ↗</a>
        {expanded && <dialog ref={dialog} className={s.mediaDialog} aria-labelledby="media-title" onCancel={() => setExpanded(false)} onClick={event => { if (event.target === dialog.current) setExpanded(false); }}>
          <div className={s.dialogHeader}><h3 id="media-title">{category}</h3><div><a href={source} target="_blank" rel="noreferrer">Відкрити окремо ↗</a><button type="button" autoFocus onClick={() => setExpanded(false)} aria-label="Закрити перегляд">✕</button></div></div>
          <object className={s.expandedDocument} data={`${source}#view=FitH`} type="application/pdf" aria-label={`Збільшений перегляд ${category}`}><a href={source} target="_blank" rel="noreferrer">Відкрити PDF</a></object>
        </dialog>}
      </> : <div className={s.empty}><span aria-hidden="true">＋</span><h3>Записів поки немає</h3><p>Тут будуть відображатися ваші дані за напрямком «{label}».</p></div>}
    </section>
  );
};

CategoryMedia.propTypes = { category: PropTypes.string.isRequired };

export default CategoryMedia;
