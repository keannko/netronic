import s from "./HelpPage.module.scss";

const HelpPage = () => {
  return (
    <>
      <div className={s.helpPageWrapper}>
        <p className={s.helpPage_title}>Хочу допомогти</p>

        <div className={s.helpPage_infoBlock}>
          <div className={`${s.infoBlock_item} ${s.firstItem}`}>
            <p className={s.infoBlock_item_title}>для фізичних осіб</p>
            <p className={s.infoBlock_item_data}>картка ПриватБанку</p>
            <p className={s.infoBlock_item_paymentData}>4246 0010 0345 6294</p>
            <p className={s.infoBlock_item_infoText}>
              При перерахуванні коштів у призначенні платежу нічого вказувати не
              потрібно, там уже автоматично прописано ”благодійний внесок”
            </p>
          </div>

          <div className={`${s.infoBlock_item} ${s.secondItem}`}>
            <p className={s.infoBlock_item_title}>для юридичних осіб</p>
            <p className={s.infoBlock_item_data}>найменування отримувача</p>
            <p className={`${s.infoBlock_item_data} ${s.colorStyle}`}>
              БО “БФ”ЧАРІВНИЦІ ДОБРА”
            </p>
            <p className={s.infoBlock_item_data}>код отримувача</p>
            <p className={s.infoBlock_item_paymentData}>44753728 </p>
            <p className={`${s.infoBlock_item_infoText} ${s.marginAdd}`}>
              Рахунок у форматі відповідно до стандарту IBAN:
              UA503052990000026008026307663 Назва банку: АТ КБ “ПРИВАТБАНК”
            </p>
          </div>

          <div className={`${s.infoBlock_item} ${s.thirdItem}`}>
            <p className={`${s.infoBlock_item_title} ${s.addTitleImg}`}>
              скануй QR-код через
            </p>
            <div className={s.qrBlock}>
              <img className={s.qrBlock_img} src="/HelpPage/qrCode.png" alt="qr_code" />
            
                <ul className={s.qrBlock_list}>
                  <li className={`${s.qrBlock_listItem} ${s.qrBlock_listItem_first}`}>Завантажте додаток Приват24</li>
                  <li className={`${s.qrBlock_listItem} ${s.qrBlock_listItem_second}`}>Увійдіть в додаток</li>
                  <li className={`${s.qrBlock_listItem} ${s.qrBlock_listItem_third}`}>Відскануйте QR-код</li>
                  <li className={`${s.qrBlock_listItem} ${s.qrBlock_listItem_fourth}`}>Оберіть картку для оплати</li>
                </ul>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default HelpPage;
