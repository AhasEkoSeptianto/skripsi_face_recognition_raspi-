var fs = require('fs');
const mongoose = require("mongoose")
const raspi = require('./raspiSchema')
  
async function GETIPESP32CAM(){
    await mongoose.connect('mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority');
    var raspiID = await fs.readFileSync('../../raspiID.txt', 'utf8');
    

    let list = await raspi.find({ "raspi_id": raspiID })
    let ipaddress = list[0]['IP_ESP32CAM']
    console.log(ipaddress)
    fs.writeFile('../IPESP32CAM.txt', ipaddress + "", (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Alamat IP berhasil disimpan dalam file ipaddress.txt');
        }
    });
}

GETIPESP32CAM()