import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isConfirmModal } from "../../redux/slices/modalSlice";
import s from "./ConfirmOrderModal.module.scss";

const ConfirmOrderModal = () => {
  const [isModalShow, setIsModalShow] = useState();
  const modalStatus = useSelector((state) => state.modal.isConfirmModal);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setIsModalShow(modalStatus);
  }, [modalStatus]);

  const handleClick = () => {
    dispatch(isConfirmModal(false))
    navigate('/shop')
  }

  return (
    <>
      {isModalShow && (
        <div className={s.modalWrapper} onClick={handleClick} >
          <div className={s.modalWindow}>
            <p className={s.modalWindow_title}>Ваше замовлення оформлено!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmOrderModal;
