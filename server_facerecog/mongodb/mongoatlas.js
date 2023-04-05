const mongoString = "mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority"

const { MongoClient } = require("mongodb");

const uri = mongoString;
const client = new MongoClient(uri);

module.exports.run = async () => {
  try {
    	const database = client.db('skripsi');
    	
	const col = database.collection('raspi_configs');
	let data = await col.find({})
	data.forEach(item => console.log(item))
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
