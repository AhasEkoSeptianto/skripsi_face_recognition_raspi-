import Config from './../../models/config/config'
import dbConnect from './../../midleware/mongodb'
import { IsIncludes } from './../../helper/isIncludes'

export default async function handler(req:any, res:any) {
    const { method } = req
    const { raspi_id, IP_AddresV4Raspi, IP_ESP32CAM } = req.body
    const { uniq_id, type } = req.query
    
    await dbConnect()

    switch (method) {
        case 'PUT':
            try{
                if (type === "raspi"){
                    await Config.findOneAndUpdate({raspi_id: raspi_id}, {
                        IP_AddresV4Raspi: IP_AddresV4Raspi,
                    },{new: true, useFindAndModify: false})
                
                    res.status(200).send({msg: 'berhasil mengubah data'});
                }else{
                    await Config.findOneAndUpdate({raspi_id: raspi_id}, {
                        IP_ESP32CAM: IP_ESP32CAM,
                    },{new: true, useFindAndModify: false})
                
                    res.status(200).send({msg: 'berhasil mengubah data'});
                }
            }catch(err){
                console.log(err)
                res.status(500).send({ msg: 'error' })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}