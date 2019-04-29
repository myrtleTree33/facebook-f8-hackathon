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
  console.log(JSON.stringify(result));

  const {
    intent: { displayName: intentName }
  } = result;

  // Do actual logic here

  console.log(`INTENT NAME=${intentName}`);

  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({
      userId
    });

    user = await user.save();
  }

  console.log('GOT HERE!!! ----------------------');

  if (!user.cities) {
    if (intentName === 'CITIES') {
      return User.findOneAndUpdate({ userId }, { cities: [message] }, { upsert: true, new: true });
    }
    return sendTextMessage(userId, 'Hello!  Where are you from?');
  } else if (!user.citiesInterested) {
    if (intentName === 'CITIES') {
      return User.findOneAndUpdate(
        { userId },
        { citiesInterested: [message] },
        { upsert: true, new: true }
      );
    }
    return sendTextMessage(userId, 'Which cities are you keen to explore?');
  } else if (!user.citiesTraveled) {
    if (intentName === 'CITIES') {
      return User.findOneAndUpdate(
        { userId },
        { citiesTraveled: [message] },
        { upsert: true, new: true }
      );
    }
    return sendTextMessage(userId, 'Which have you travled to?');
  }

  sendTextMessage(userId, result.fulfillmentText);
};
