var admin = require("firebase-admin");
var serviceAccount = require("./privateKey.json");
const m = require("./mongodb/mongoose.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (title, body) => {
  let token = await m.getTokenNotification();
  token = token?.[0]?.messanggingID?.split(",");
  try {
    token?.forEach(async (fcm_token) => {
      if (fcm_token) {
        console.log(fcm_token, "<========== token");
        let message = {
          android: {
            notification: {
              title: title,
              body: body,
            },
          },
          token: fcm_token,
        };
        try {
          await admin.messaging().send(message);
        } catch (er) {
          console.log(er);
        }
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { sendPushNotification };
