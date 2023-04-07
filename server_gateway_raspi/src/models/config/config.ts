import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var config = new Schema({
    raspi_id: {
        type: String,
        required: true
    },
    mobileAppsCon: {
        type: String,
    },
    raspi_wifi_ssid: {
        type: String
    },
    raspi_wifi_password: {
        type: String
    },
    esp32cam_wifi_ssid:{
        type: String
    },
    esp32cam_wifi_password:{
        type: String
    },
    IP_AddresV4Raspi: {
        type: String
    },
    IP_ESP32CAM: {
        type: String
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});

var Config = mongoose.models.raspi_config || mongoose.model('raspi_config', config);


export default Config;