import Config from './../../models/config/config'
import dbConnect from './../../midleware/mongodb'
import { IsIncludes } from './../../helper/isIncludes'

export default async function handler(req:any, res:any) {
    const { method } = req
    const { raspi_id, mobileAppsCon, raspi_wifi_ssid, raspi_wifi_password, esp32cam_wifi_ssid, esp32cam_wifi_password, created_at } = req.body
    const { uniq_id } = req.query
    
    await dbConnect()

    switch (method) {
        
        case 'GET':
            try {
                let raspi_id = req.query.raspi_id || ''

                let queryExe = { raspi_id: IsIncludes(raspi_id)}
                
                let data_config = await Config.find(queryExe).sort({ createdAt: -1 })
                res?.status(200).json({ msg: 'berhasil mengambil data', data: data_config })

            }catch(err){
                res.status(500).send({ msg: 'error', err: err })
            }
            break

        case 'POST':
            try {
                let raspi_config = new Config({
                    raspi_id: raspi_id,
                    mobileAppsCon: mobileAppsCon,
                    raspi_wifi_ssid: raspi_wifi_ssid,
                    raspi_wifi_password: raspi_wifi_password,
                    esp32cam_wifi_ssid: esp32cam_wifi_ssid,
                    esp32cam_wifi_password: esp32cam_wifi_password,
                    created_at: created_at
                })
            
                try {
                    raspi_config.save()
                    res.status(200).json({  msg:'berhasil menambahkan raspi '});
                }catch{
                    res.status(500).send({ msg: 'gagal menyimpan data' })
                }

            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'PUT':
            try{
                await Config.findOneAndUpdate({_id: uniq_id}, {
                    raspi_id: raspi_id,
                    mobileAppsCon: mobileAppsCon,
                    raspi_wifi_ssid: raspi_wifi_ssid,
                    raspi_wifi_password: raspi_wifi_password,
                    esp32cam_wifi_ssid: esp32cam_wifi_ssid,
                    esp32cam_wifi_password: esp32cam_wifi_password,
                    created_at: created_at
                },{new: true, useFindAndModify: false})
            
                res.status(200).send({msg: 'berhasil mengubah data'});
            }catch(err){
                res.status(500).send({ msg: 'error' })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}