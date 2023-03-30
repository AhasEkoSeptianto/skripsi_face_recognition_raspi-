import Config from './../../models/config/config'
import dbConnect from './../../midleware/mongodb'
import { IsIncludes } from './../../helper/isIncludes'

export default async function handler(req:any, res:any) {
    const { method } = req
    const { raspi_id } = req.body
    
    
    await dbConnect()

    switch (method) {
        
        case 'POST':
            try {
                let raspi_ids = raspi_id || ''

                let queryExe = { raspi_id: IsIncludes(raspi_ids)}
                
                let raspi = await Config.find(queryExe).sort({ createdAt: -1 })
                
                if (raspi.length > 0){
                    res.status(200).json({ msg: 'success', data: raspi });
                }else{
                    res.status(400).json({ msg: 'unknow raspi id' })
                }
                
            } catch (error) {
                res.status(500).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}