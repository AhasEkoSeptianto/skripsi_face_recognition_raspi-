import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var anggota = new Schema({
    raspi_id: {
        type: String,
        required: true
    },
    mobileAppsCon: {
        type: String,
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});


var Anggota = mongoose.model('raspi-config', anggota);

export default Anggota;