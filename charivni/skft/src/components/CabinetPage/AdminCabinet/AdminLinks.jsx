import { useEffect, useState } from 'react';
import { createAdminLink, deleteAdminLink, getAdminLinks, updateAdminLink } from '../../../utils/admin';
import CabinetDialog from '../UserCabinet/CabinetDialog';
import s from '../UserCabinet/UserCabinet.module.scss';

export default function AdminLinks() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    let active = true;
    getAdminLinks()
      .then(items => { if (active) setLinks(items); })
      .catch(error => { if (active) setError(error.response?.data?.message || 'Не вдалося завантажити посилання.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const addLink = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const link = await createAdminLink({ title, url });
      setLinks(items => [...items, link]);
      setTitle('');
      setUrl('');
    } catch (error) {
      setError(error.response?.data?.message || 'Не вдалося додати посилання.');
    } finally {
      setBusy(false);
    }
  };

  const removeLink = async id => {
    setBusy(true);
    setModalError('');
    try {
      await deleteAdminLink(id);
      setLinks(items => items.filter(link => link.id !== id));
      setEditing(null);
    } catch (error) {
      setModalError(error.response?.data?.message || 'Не вдалося видалити посилання.');
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async event => {
    event.preventDefault();
    setBusy(true);
    setModalError('');
    try {
      const updated = await updateAdminLink(editing.id, { title: editing.title, url: editing.url });
      setLinks(items => items.map(link => link.id === updated.id ? updated : link));
      setEditing(null);
    } catch (error) {
      setModalError(error.response?.data?.message || 'Не вдалося зберегти вікно.');
    } finally {
      setBusy(false);
    }
  };

  return <section className={s.card} aria-label="Мої вікна">
    <h2>Мої вікна</h2>
    {loading && <p className={s.hint} role="status">Завантаження посилань…</p>}
    {!loading && links.length === 0 && <p className={s.hint}>Додайте перше вікно з посиланням.</p>}
    <div className={s.linkGrid}>
      {links.map((link, index) => <div className={s.linkCard} key={link.id}>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className={s.linkCardAnchor}>
          <span className={s.linkCardArt} style={{ backgroundPosition: `${(index % 4) * 33}% ${Math.floor(index / 4) % 3 * 50}%` }} aria-hidden="true" />
          <strong>{link.title}</strong>
        </a>
        <button type="button" className={s.linkMenu} onClick={() => { setEditing({ ...link }); setModalError(''); }} aria-label={`Редагувати ${link.title}`} title="Редагувати вікно">⋯</button>
      </div>)}
    </div>
    <form className={s.linkForm} onSubmit={addLink}>
      <div className={s.field}><label htmlFor="admin-link-title">Назва вікна</label><input id="admin-link-title" required maxLength="100" value={title} onChange={event => setTitle(event.target.value)} /></div>
      <div className={s.field}><label htmlFor="admin-link-url">Посилання</label><input id="admin-link-url" type="url" required maxLength="2048" placeholder="https://example.com" value={url} onChange={event => setUrl(event.target.value)} /></div>
      <button className={s.saveButton} disabled={busy}>Додати вікно +</button>
    </form>
    {error && <p className={s.error} role="alert">{error}</p>}
    {editing && <CabinetDialog title="Редагувати вікно" busy={busy} onClose={() => setEditing(null)}>
      <form className={s.linkEditForm} onSubmit={saveEdit}>
        <div className={s.field}><label htmlFor="edit-link-title">Назва вікна</label><input id="edit-link-title" required maxLength="100" value={editing.title} onChange={event => setEditing(link => ({ ...link, title: event.target.value }))} /></div>
        <div className={s.field}><label htmlFor="edit-link-url">Посилання</label><input id="edit-link-url" type="url" required maxLength="2048" value={editing.url} onChange={event => setEditing(link => ({ ...link, url: event.target.value }))} /></div>
        {modalError && <p className={s.error} role="alert">{modalError}</p>}
        <div className={s.linkEditActions}>
          <button type="button" className={s.cancelButton} disabled={busy} onClick={() => removeLink(editing.id)}>Видалити</button>
          <button type="button" className={s.cancelButton} disabled={busy} onClick={() => setEditing(null)}>Скасувати</button>
          <button className={s.saveButton} disabled={busy}>Зберегти</button>
        </div>
      </form>
    </CabinetDialog>}
  </section>;
}
