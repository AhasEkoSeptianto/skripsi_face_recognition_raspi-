var fs = require('fs');
const mongoose = require("mongoose")
const raspi = require('./raspiSchema')
  
module.exports.saveHost =  async (host) => {
    await mongoose.connect('mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority');
    var raspiID = await fs.readFileSync('../raspiID.txt', 'utf8');
    

    let list = await raspi.findOneAndUpdate({ "raspi_id": raspiID }, { "$set": { "mobileAppsCon": host } }, { "new": true })
    // let list = await raspi.find({"raspi_id": raspiID})
    console.log(list)
}

module.exports.getTokenNotification = async () => {
    
    await mongoose.connect('mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority');
    var raspiID = await fs.readFileSync('../raspiID.txt', 'utf8');

    return await raspi.find({ "raspi_id": raspiID })
    
}