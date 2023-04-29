const mongoose = require("mongoose")

const raspiSchema = new mongoose.Schema({
	raspi_id: {
		type: String,
	},
	mobileAppsCon:{
		type: String,
	},
	raspi_wifi_ssid: {
		type: String,
	},
	raspi_wifi_password: {
		type: String,
	},
	esp32cam_wifi_ssid: {
		type: String,
	},
	esp32cam_wifi_password: {
		type: String,
	},
	messanggingID: {
		type: String
	}
})

const raspi = mongoose.model("raspi_config", raspiSchema);
module.exports = raspi;
