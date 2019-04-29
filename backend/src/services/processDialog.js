import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
import axios from 'axios';
import User from '../models/User';

const {
  PROJECT_ID,
  SESSION_ID,
  LANGUAGE_CODE,
  DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_CLIENT_EMAIL,
  PAGE_ACCESS_TOKEN
} = process.env;

// You can find your project ID in your Dialogflow agent settings
const projectId = PROJECT_ID;
const sessionId = SESSION_ID;
const languageCode = LANGUAGE_CODE;

const config = {
  credentials: {
    private_key: DIALOGFLOW_PRIVATE_KEY,
    client_email: DIALOGFLOW_CLIENT_EMAIL
  }
};

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const sendTextMessage = async (userId, text) => {
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
};

export default async event => {
  const userId = event.sender.id;
  const message = event.message.text;
  console.log('GOT HERE------------------------');

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode
      }
    }
  };
  const results = await sessionClient.detectIntent(request);
  const result = results[0].queryResult;
  console.log(JSON.stringify(results));

  // Do actual logic here

  const user = await User.findOne({ userId });

  if (!user || !user.cities) {
    sendTextMessage(userId, 'Hello!  Where are you from?');
    return;
  } else if (!user.citiesInterested) {
    sendTextMessage(userId, 'Which cities are you keen to explore?');
    return;
  } else if (!user.citiesTraveled) {
    sendTextMessage(userId, 'Which have you travled to?');
    return;
  }

  sendTextMessage(userId, result.fulfillmentText);
};
