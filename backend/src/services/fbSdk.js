import logger from '../logger';
import axios from 'axios';

const { PAGE_ACCESS_TOKEN } = process.env;

async function sendMessage({ userId, text }) {
  try {
    await axios.post(
      `https://graph.facebook.com/v3.2/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        messaging_type: 'RESPONSE',
        recipient: {
          id: userId
        },
        message: {
          text
        }
      }
    );
  } catch (e) {}
}

async function sendQuestions({ userId, title, buttonArr = [] }) {
  const buttons = buttonArr.map(btn => {
    return {
      type: 'postback',
      title: btn.title,
      payload: btn.payload
    };
  });

  try {
    await Axios.post(
      `https://graph.facebook.com/v3.2/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        recipient: {
          id: userId
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: title,
              buttons
            }
          }
        }
      }
    );
  } catch (e) {
    logger.error(e);
  }
}

export default {
  sendQuestions,
  sendMessage
};
