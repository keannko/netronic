import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isModal } from "../../redux/slices/modalSlice";
import s from "./Modal.module.scss";

const Modal = (props) => {
const {modalContent} = props
  const [isModalShow, setIsModalShow] = useState();
  const modalStatus = useSelector((state) => state.modal.isModal);
  const dispatch = useDispatch()

  useEffect(() => {
    setIsModalShow(modalStatus);
  }, [modalStatus]);

  const handleClick = () => {
    dispatch(isModal(false))
  }

  return (
    <>
      {isModalShow && (
        <div className={s.modalWrapper} onClick={handleClick} >
          <div className={s.modalWindow}>
            <p className={s.modalWindow_title}>{modalContent}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
