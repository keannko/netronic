import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import s from "./UserCabinet.module.scss";

const CabinetDialog = ({ title, children, onClose, busy = false }) => {
  const ref = useRef(null);
  useEffect(() => {
    const focused = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current.showModal();
    return () => { document.body.style.overflow = overflow; focused?.focus(); };
  }, []);
  return <dialog ref={ref} className={`${s.workdayDialog} ${s.wideWorkdayDialog}`} aria-labelledby="cabinet-dialog-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} onClick={event => { if (event.target === ref.current && !busy) onClose(); }}><div className={s.workdayDialogBody}><div className={s.cardHeading}><h2 id="cabinet-dialog-title">{title}</h2><button type="button" className={s.cancelButton} disabled={busy} onClick={onClose} aria-label="Закрити">✕</button></div>{children}</div></dialog>;
};
CabinetDialog.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node.isRequired, onClose: PropTypes.func.isRequired, busy: PropTypes.bool };
export default CabinetDialog;