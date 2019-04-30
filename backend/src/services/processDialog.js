import fetch from 'node-fetch';
import dialogflow from 'dialogflow';
import axios from 'axios';
import User from '../models/User';
import geocodeService from './geocodeService';
import Question from '../models/Question';
import fbSdk from './fbSdk';
import botSdk from './botSdk';
import Answer from '../models/Answer';
import logger from '../logger';

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

  const intentName = result && result.intent && result.intent.displayName;

  // Do actual logic here

  console.log(`INTENT NAME=${intentName}`);

  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({
      userId
    });

    user = await user.save();
  }

  // Be nice and send a welcome message
  if (intentName === 'WELCOME') {
    sendTextMessage(userId, result.fulfillmentText);
  }

  if (!user.cities || !user.cities.length) {
    if (intentName === 'CITIES') {
      const cities = await geocodeService.findCities(message);
      await User.findOneAndUpdate({ userId }, { cities }, { upsert: true, new: true });
      return sendTextMessage(
        userId,
        `OK!  I've set your home city to ${cities}.  Which cities are you keen to explore?`
      );
    }
    return sendTextMessage(userId, 'Which city do you live in?');
  } else if (!user.citiesInterested || !user.citiesInterested.length) {
    if (intentName === 'CITIES') {
      const cities = await geocodeService.findCities(message);
      await User.findOneAndUpdate(
        { userId },
        { citiesInterested: cities },
        { upsert: true, new: true }
      );
      return sendTextMessage(
        userId,
        `OK!  You're interested in exploring ${cities}.  Which cities have you visited?`
      );
    }
    return sendTextMessage(userId, 'Which cities are you keen to explore?');
  } else if (!user.citiesTraveled || !user.citiesTraveled.length) {
    if (intentName === 'CITIES') {
      const cities = await geocodeService.findCities(message);
      await User.findOneAndUpdate(
        { userId },
        { citiesTraveled: cities },
        { upsert: true, new: true }
      );
      return sendTextMessage(
        userId,
        `OK!  You're interested in traveling to ${cities}.  Let's begin! (:`
      );
    }

    return sendTextMessage(userId, 'Which have you traveled to?');
  }

  // ----------------------
  console.log('GOT HERE -------------------------');
  console.log('GOT HERE -------------------------');
  console.log('GOT HERE -------------------------');

  if (intentName === 'WELCOME') {
    return; // Ignore as we have already sent welcome message
  }

  // Find a user, then retrieve if user has a prev
  // qn state.  If so, then answer.
  const { currQn } = user;
  if (!currQn) {
    await botSdk.askQuestions({ userId, maxNum: 3 });
    return;
  }

  // Else, store the bot answers
  const { id, city, title } = currQn;
  if (message && message !== '') {
    await new Answer({
      questionId: id,
      userId,
      questionText: title,
      text: message,
      city
    }).save();

    fbSdk.sendMessage({ userId, text: 'Thanks for contributing!' });
    logger.info('Saved user answer!');

    // Ask another question
    setTimeout(() => {
      (async () => {
        await fbSdk.sendMessage({ userId, text: `Here's another question!` });
        await botSdk.askQuestions({ userId, maxNum: 3 });
      })();
    }, 10000);
  }

  // Else, continue asking question logic here
  // await botSdk.askQuestions({ userId, maxNum: 3 });

  sendTextMessage(userId, result.fulfillmentText);
};
