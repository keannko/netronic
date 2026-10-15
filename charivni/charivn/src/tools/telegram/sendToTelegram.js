import axios from "axios";

const sendToTelegram = async (data) => {
  const BOT_TOKEN = "6608359804:AAFLUDsVS1NX-mognb-mgB0I0uIOMUp4VH0";
  const CHAT_ID = "750043908";
  const message = data;

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message,
      }
    );
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
  }
};

export default sendToTelegram

