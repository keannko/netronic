import s from './Footer.module.scss'

const Footer = () => {
    
  return (
    <>
      <div className={s.footerWrapper} id='footer'>
     <div className={s.footer_content}>
          <div>
            <div className={s.footer_content_item}>Ми в соціальних мережах:</div>
            <div className={s.footer_content_item_socialLogoBlock}>
              <img src="/icon_instagram.png" alt="" />
              <img src="/icon_facebook.png" alt="" />
            </div>
            </div>
          <div>
            <div className={s.footer_content_item}>Наші контакти:</div>
            <div className={s.footer_content_item_contactsBlock}>
              <p className={s.contactsPhone}>+380 93 785 9415</p>
              <p className={s.contactsMail}>charivnyci.dobra.2022@gmail.com</p>
            </div>
            </div>
          <div>
            <div className={s.footer_content_item}>Меню:</div>
            <div className={s.footer_content_item_menuBlock}>
              <div className={s.menuBlock_item}>
                <p>Головна</p>
                <p>Про нас</p>
                <p>Проекти</p>
              </div>
              <div className={s.menuBlock_item}>
                <p>Кому допомогли</p>
                <p>Команда</p>
                <p>Контакти</p>
              </div>
            </div>
            </div>
     </div>
     <div className={s.footer_info}>
      <div className={s.footer_info_item}>2022, Благодійна організація “Благодійний фонд “ЧАРІВНИЦІ ДОБРА”</div>
      <div className={s.footer_info_item}>код ЄДРПОУ 44753728</div>
      <div className={s.footer_info_item}>неприбуткова організація, від 16.07.2022</div>
     </div>
      </div>
    </>
  );
};

export default Footer;
