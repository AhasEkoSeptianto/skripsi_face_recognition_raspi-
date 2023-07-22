var fs = require("fs");
const mongoose = require("mongoose");
const raspi = require("./raspiSchema");
const UnknowFaces = require("./UnknowFace");

module.exports.saveHost = async (host) => {
  await mongoose.connect(
    "mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority"
  );
  var raspiID = await fs.readFileSync("../raspiID.txt", "utf8");

  let list = await raspi.findOneAndUpdate(
    { raspi_id: raspiID },
    { $set: { mobileAppsCon: host } },
    { new: true }
  );
};

module.exports.getTokenNotification = async () => {
  await mongoose.connect(
    "mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority"
  );
  var raspiID = await fs.readFileSync("../raspiID.txt", "utf8");

  return await raspi.find({ raspi_id: raspiID });
};

module.exports.saveDataUnknowFace = async (fileName, created_at) => {
  await mongoose.connect(
    "mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority"
  );

  let dataSave = await UnknowFaces.create({
    file_name: fileName,
    created_at: created_at,
  });

  dataSave.save();
  return dataSave;
};

module.exports.DataUnknowFaceDetail = async (fileName, created_at) => {
  await mongoose.connect(
    "mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority"
  );

  return await UnknowFaces.find({});
};
