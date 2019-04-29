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
  return axios.post(
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
};

export default async event => {
  const userId = event.sender.id;
  const message = event.message.text;

  const user = await User.findOne({ userId });
  if (!user || !user.cities || !user.citiesInterested || !user.citiesTraveled) {
    console.log('I GOT HERR');
    return sendTextMessage(userId, 'Hello!  Where are you from?');
  }

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
  console.log(JSON.stringify(results));
  const result = results[0].queryResult;
  return sendTextMessage(userId, result.fulfillmentText);
};
