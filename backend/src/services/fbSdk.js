import logger from '../logger';
import Axios from 'axios';

const { PAGE_ACCESS_TOKEN } = process.env;

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
    // logger.error(e);
  }
}

export default {
  sendQuestions
};
