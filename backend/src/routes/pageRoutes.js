import { Router } from 'express';
import logger from '../logger';

const routes = Router();

const { PAGE_ACCESS_TOKEN, VERIFY_TOKEN } = process.env;

// function callSendAPI( async (sender_psid, response) => {
//   let request_body = {
//     recipient: {
//       id: sender_psid
//     },
//     message: response
//   };

//   request(
//     {
//       uri: 'https://graph.facebook.com/v2.6/me/messages',
//       qs: { access_token: PAGE_ACCESS_TOKEN },
//       method: 'POST',
//       json: request_body
//     },
//     (err, res, body) => {
//       if (!err) {
//         console.log('message sent!');
//       } else {
//         console.error(`Unable to send message: ${err}`);
//       }
//     }
//   );
// }

// function handleMessage(senderPsid, receivedMessage) {
//   let response;
//   if (receivedMessage.text) {
//     response = {
//       text: `You sent the message: ${receivedMessage.text}. Now send me an image!`
//     };
//   }
//   callSendAPI(senderPsid, response);
// }

routes.get('/', (req, res) => {
  res.json({ message: 'Facebook pages backend' });
});

routes.get('/webhook', (req, res, next) => {
  const hubChallenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];
  if (verifyToken === VERIFY_TOKEN) {
    logger.info(`Sent hub challenge ${hubChallenge}`);
    return res.send(hubChallenge);
  }
  res.send('wrong token');
});

routes.post("/webhook", function(req, res) {
  console.log("WEBHOOK GET IT WORKS");
  var data = req.body;
  console.log(data);

  // Make sure this is a page subscription
  if (data.object == 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(function(pageEntry) {
          var pageID = pageEntry.id;
          var timeOfEvent = pageEntry.time;

          // Iterate over each messaging event
          pageEntry.messaging.forEach(function(messagingEvent) {
              if (messagingEvent.optin) {
                  // receivedAuthentication(messagingEvent);
              } else if (messagingEvent.message) {
                  // receivedMessage(messagingEvent);
              } else if (messagingEvent.postback) {
                  // receivedPostback(messagingEvent);
              } else {
                  console.log("Webhook received unknown messagingEvent: ", messagingEvent);
              }
          });
      });

      res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderId = event.sender.id;
  var content = event.message.text;
  var echo_message = "ECHO : " + content;
  sendTextMessage(senderId, echo_message);
}

function receivedPostback(event) {
  console.log("RECEIVED POSTBACK IT WORKS");
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
      "at %d", senderID, recipientID, payload, timeOfPostback);

  sendTextMessage(senderID, "Postback called");
}

function sendTextMessage(recipientId, message) {
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: {
          recipient: { id: recipientId },
          message: { text: message }
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending message: ' + response.error);
      }
  });
}
// routes.post('/webhook', (req, res) => {
//   const { body } = req;
//   console.log(`Received payload=${JSON.stringify(body)}`);

//   if (body.object === 'page') {
//     // TODO: Find and do something to the event page
//     // TODO: save user pid
//     res.send('EVENT_RECEIVED');
//   } else {
//     res.sendStatus(404);
//   }
// });

export default routes;
