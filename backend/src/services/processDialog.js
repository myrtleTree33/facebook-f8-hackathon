import fetch from 'node-fetch';
import dialogflow from 'dialogflow';

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

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.

const sendTextMessage = async (userId, text) => {
  return fetch(`https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      messaging_type: 'RESPONSE',
      recipient: {
        id: userId
      },
      message: {
        text
      }
    })
  });
};

export default async event => {
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
  const result = results[0].queryResult;
  return sendTextMessage(userId, result.fulfillmentText);
};
