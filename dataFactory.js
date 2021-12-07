const axios = require('axios')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const db = require('./config/database.js')
const flowdata = require('./app/models/flowdata.js')
const location = require('./app/models/location.js')

const baseUrl = 'http://localhost:3000/api/'
const randomAddresses = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'randomAddresses.json').toString()))

const createFlowdata = (location, flowRate) => {
    const timestamp = (new Date()).getTime()
    return axios.post(`${baseUrl}flowdata`, {
        location: location, 
        flowRate: flowRate,
        timestamp: timestamp
    })
}

const getNormalValue = (num, max) => {
    let randomValue = 0
    for(let i = 0; i < num; i++){
        randomValue += max * (Math.random() - (1/2))
    }
    return randomValue / num
}

const main = async () => {
    db()
    flowdata.collection.drop()
    location.collection.drop()
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
        const locs = (await axios.post(`${baseUrl}location`, params)).data.data
        locsId.push(locs._id)
    }

    const locations = (await axios.get(`${baseUrl}location`)).data.data
    const flowData = {}
    
    setInterval(async () => {
        for(let i = 0; i < locsId.length; i++){
            const location = locsId[i]
            if(flowData[location]){
                const changeUp = Math.random() * 100 > 60
                if(changeUp){
                    flowData[location] = Math.random() * 100
                }else{
                    let randomValue = getNormalValue(5, 1)
                    flowData[location] = Math.max(0, flowData[location] + randomValue)
                }
    
            }else{
                flowData[location] = Math.random() * 100
            }
            
            const resp = (await createFlowdata(location, flowData[location])).data
            console.log(resp)
        }
    }, 5000)
}

main()