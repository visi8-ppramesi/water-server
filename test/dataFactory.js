const axios = require('axios')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const db = require('../config/database.js')
const flowdata = require('../app/models/flowdata.js')
const location = require('../app/models/location.js')
const { create: createLocation } = require('../app/services/location.js')

const randomAddresses = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'randomAddresses.json').toString()))

const now = (new Date())

const todayStart = +(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
const todayEnd = +(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))

const thisMonthStart = +(new Date(now.getFullYear(), now.getMonth()))
const thisMonthEnd = +(new Date(now.getFullYear(), now.getMonth() + 1))

const thisYearStart = +(new Date(now.getFullYear(), 0, 1))
const thisYearEnd = +(new Date(now.getFullYear() + 1, 0, 1))

const minRate = 0
const maxRate = 10

const minRateChange = -1
const maxRateChange = 1

const generateFakeFlowrate = (prevValue) => {
    if(Math.random() * 10 > 9.5){
        return Math.min(maxRate, Math.max(minRate, prevValue + Math.random() * (maxRateChange - minRateChange) + minRateChange))
    }else{
        return Math.min(maxRate, Math.max(minRate, prevValue + (Math.random() * 0.001 - 0.0005)))
    }
}

const main = async () => {
    db()
    await flowdata.collection.drop()
    await location.collection.drop()
    const locsId = []

    for(let i = 0; i < 10; i++){
        const latitude = Math.random() * 180 - 90
        const longitude = Math.random() * 360 - 180
        const address = randomAddresses[Math.floor(Math.random() * randomAddresses.length)]
        const name = (Math.random() + 1).toString(36).slice(2)
        const params = {}
        params.name = name
        params.address = address
        params.geocoordinate = { latitude, longitude }
        if(locsId.length > 1 && Math.random() > 0.5){
            params.parent = locsId[Math.floor(Math.random() * locsId.length)]
        }
        // const locs = (await axios.post(`${baseUrl}location`, params)).data.data
        await createLocation(params)
        // locsId.push(locs._id)
    }
    console.log('locs created')

    const locations = await location.find({})
    locations.forEach((loc) => {
        loc.flowdata = []
        loc.save()
    })
    const ids = locations.map(v => v._id.toString())
    const currentFlowrates = Array(locations.length).fill(0)
    const readFlowrates = Array(locations.length).fill(0)
    const changes = Array(locations.length).fill(null).map(v => [])

    let count = 0

    for(let i = thisYearStart; i < thisYearEnd; i += 1000 * 60 * 5){
        for(let j = 0; j < locations.length; j++){
            let currentFlowrateTemp = generateFakeFlowrate(currentFlowrates[j])
            let noisedTime = Math.round(i + (Math.random() * (1000 * 60) - (500 * 60)))
            if(Math.abs(readFlowrates[j] - currentFlowrateTemp) > (maxRate - minRate) * 0.01){
                readFlowrates[j] = currentFlowrateTemp
                changes[j].push({location: ids[j], timestamp: +(new Date(noisedTime)), flowRate: currentFlowrateTemp})
                const newFlowdata = new flowdata({
                    location: ids[j],
                    timestamp: +(new Date(noisedTime)),
                    flowRate: currentFlowrateTemp
                })
                await newFlowdata.save()

                locations[j].flowdata.push(newFlowdata)
                await locations[j].save()
            }
            currentFlowrates[j] = currentFlowrateTemp
        }
        if(count % 100 == 0){
            console.log(new Date(i))
        }
        
        count++
    }

    console.log(JSON.stringify(changes).length)

    process.exit(0)
}

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(0);
});

main()