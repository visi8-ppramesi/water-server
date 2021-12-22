const db = require('../config/database.js')
const location = require('../app/models/location.js')

const findAndUpdate = async () => {
    return new Promise((resolve, reject) => {
        location.find({}, (err, locations) => {
            if (err) { 
                console.log('error');
                process.exit(1);
            }
            const locPromises = locations.reduce((acc, loc) => {
                const lastUpdate = loc.lastStatusTimestamp
                const time = +(new Date())
                
                if(loc.locationStatus !== 'ERROR'){
                    if(time > lastUpdate + (1000 * 60 * 5)){
                        loc.locationStatus = 'OFF'
                    }else{
                        loc.locationStatus = 'ON'
                    }
                    acc.push(loc.save())
                }
                return acc
            }, [])
            resolve(locPromises)
        })
    })
}

(async () => {
    db()
    await findAndUpdate()
    process.exit(0)
})()