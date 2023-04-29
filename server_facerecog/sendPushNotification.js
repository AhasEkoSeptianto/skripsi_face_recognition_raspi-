var admin = require("firebase-admin");
var serviceAccount = require("./privateKey.json");
const  m = require("./mongodb/mongoose.js")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



const sendPushNotification= async (title, body) => {
    let token = await m.getTokenNotification()
    token = token?.[0]?.messanggingID?.split(',')
    
    try{
        
        token?.forEach(fcm_token => {
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
        
                admin.messaging().send(message)
                    .then(res => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })

    }catch(err){
        throw err;
        }

    }
    
sendPushNotification("Peringatan !!", "Terdeteksi wajah seseorang yang tidak dikenal")