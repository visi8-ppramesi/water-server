const axios = require('axios')
const _ = require('lodash')
const db = require('../config/database.js')
const location = require('../app/models/location.js')

const baseUrl = 'http://localhost:3000/api/'

let signaler = true

const executor = async (func, time) => {
    func()
    while(signaler){
        await new Promise((res, rej) => {
            setTimeout(() => {
                res(func())
            }, time)
        })
    }
}

const main = async () => {    
    db()

    const locations = await location.find({})
    const ids = locations.map(v => v._id.toString())
    const params = {
        status: 'ON'
    }
    ids.map((id) => {
        executor(() => {
            console.log(`calling ${baseUrl}location/ping/${id}`)
            return axios.post(`${baseUrl}location/ping/${id}`, params)
        }, 1000 * 60 * 4.99)
    })

    // for(let i = 0; i < 10; i++){
    //     const latitude = Math.random() * 180 - 90
    //     const longitude = Math.random() * 360 - 180
    //     const address = randomAddresses[Math.floor(Math.random() * randomAddresses.length)]
    //     const name = (Math.random() + 1).toString(36).slice(2)
    //     const params = {}
    //     params.name = name
    //     params.address = address
    //     params.geocoordinate = { latitude, longitude }
    //     if(locsId.length > 1 && Math.random() > 0.5){
    //         params.parent = locsId[Math.floor(Math.random() * locsId.length)]
    //     }
    //     const locs = (await axios.post(`${baseUrl}location`, params)).data.data
    //     locsId.push(locs._id)
    // }

    // const locations = (await axios.get(`${baseUrl}location`)).data.data
    // const flowData = {}
    
    // setInterval(async () => {
    // }, 10000)
}

main()