import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
import axios from 'axios';

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
  console.log('************');
  console.log(userId);
  console.log(text);
  console.log('************');

  return await axios.post(
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
  console.log(JSON.stringify(event));
  const userId = event.sender.id;
  const message = event.message.text;

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
  console.log(JSON.stringify(event));
  const result = results[0].queryResult;
  return sendTextMessage(userId, result.fulfillmentText);
};
