import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getImages, deleteImage } from "../../../utils/admin";
import CabinetDialog from "./CabinetDialog";
import s from "./UserCabinet.module.scss";

const SectionImages = ({ category, editable = false, version = 0 }) => {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setError('');
    getImages().then(data => { if (active) setImages(data.filter(image => image.category === category)); }).catch(error => { if (active) setError(error.response?.data?.message || 'Не вдалося завантажити зображення.'); });
    return () => { active = false; };
  }, [category, version, retry]);
  const remove = async id => {
    setBusy(true);
    try { await deleteImage(id); setImages(previous => previous.filter(image => image.id !== id)); }
    catch (error) { setError(error.response?.data?.message || 'Не вдалося видалити зображення.'); }
    finally { setBusy(false); }
  };
  return <div>{error && <p className={s.error} role="alert">{error}<button className={s.retry} onClick={() => setRetry(value => value + 1)}>Повторити</button></p>}<div className={s.imageGallery}>{images.map(image => <div key={image.id}><button type="button" className={s.imageThumbnail} onClick={() => setSelected(image)} aria-label={`Збільшити ${image.name}`}><img src={image.source} alt={image.name} loading="lazy" /></button>{editable && <button className={s.cancelButton} disabled={busy} onClick={() => remove(image.id)}>Видалити</button>}</div>)}</div>{selected && <CabinetDialog title={selected.name} onClose={() => setSelected(null)}><img className={s.fullImage} src={selected.source} alt={selected.name} /></CabinetDialog>}</div>;
};
SectionImages.propTypes = { category: PropTypes.string.isRequired, editable: PropTypes.bool, version: PropTypes.number };
export default SectionImages;