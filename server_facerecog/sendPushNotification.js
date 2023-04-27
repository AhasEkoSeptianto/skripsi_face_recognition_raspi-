var admin = require("firebase-admin");
var fcm = require('fcm-notification');
var serviceAccount = require("./privateKey.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

const sendPushNotification= (title, body) => {
    let fcm_token = "fqhqfKdjR2-YXO6LY9CvlR:APA91bEI9SJYzxoMLs4E8FY8fxiE2zqbes_QQ4vPOd3S586b-Cxj0SzL7ecUXplda3aRKRgNIR33iEtx2koNG0Q_qv3ypiDs8wFzs6cA_PAvoSw2o4pq_vPYnDmgMtbc6ohEDG0slxhM"

    try{
        let message = {
            android: {
                notification: {
                    title: title,
                    body: body,
                },
            },
            token: fcm_token
        };

        FCM.send(message, function(err, resp) {
            if(err){
                throw err;
            }else{
                console.log('Successfully sent notification');
            }
        });

    }catch(err){
        throw err;
        }

    }
    
sendPushNotification("Hallo", "Apa Kabar")
