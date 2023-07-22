var admin = require("firebase-admin");
var serviceAccount = require("./privateKey.json");
const  m = require("./mongodb/mongoose.js")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



const sendPushNotification= async (title, body) => {
    console.log('heress')
    let token = await m.getTokenNotification()
    token = token?.[0]?.messanggingID?.split(',')
    
    try{
        
        token?.forEach(async fcm_token => {
			console.log(fcm_token, '<=====')
            if (fcm_token){
                let message = {
                    android: {
                        notification: {
                            title: title,
                            body: body,
                        },
                    },
                    token: fcm_token
                };
        
                const res = await admin.messaging().send(message)
                console.log(res)
            }
        })

    }catch(err){
    	console.log(err);
        throw err;
        }

    }
    
module.exports = { sendPushNotification }
// sendPushNotification("Peringatan !!", "Terdeteksi wajah seseorang yang tidak dikenal")
