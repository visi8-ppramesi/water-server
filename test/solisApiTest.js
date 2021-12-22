const axios = require('axios')
const crypto = require('crypto')
const env = require('dotenv').config().parsed
const _ = require('lodash')

const baseUrl = new URL('https://www.soliscloud.com:13333/')
const plantId = '1298491919448679434'

const createApiAuth = ({verb = 'POST', contentMd5, contentType = "application/json", date = (new Date()).toGMTString(), canonSource}) => {
    const authPreEncryptedText = [verb, contentMd5, contentType, date, canonSource].join('\n')
    console.log(authPreEncryptedText)
    const encryptedText = crypto.createHmac('sha1', env.SOLIS_SECRET_KEY)
        .update(authPreEncryptedText)
        .digest('base64')
    return 'API ' + env.SOLIS_KEY_ID + ':' + encryptedText
}

const toMd5 = (text) => {
    if(typeof text == 'object'){
        text = JSON.stringify(text)
    }
    return crypto.createHash('md5').update(text).digest('base64')
}

const test = async () => {
    const testPath = '/v1/api/inveterList'
    // const testPath = '/chart/station/day/v2'
    baseUrl.pathname = testPath
    const fullUrl = baseUrl.toString()
    const date = (new Date()).toGMTString()
    const data = {}//{ id: "1298491919448679434", month: "2021-11", money: 'IDR', language: "2" }
    const md5Data = toMd5(data)
    const apiAuth = createApiAuth({
        contentMd5: md5Data,
        canonSource: testPath,
        date: date
    })
    const getData = async () => {
        const postData = await axios.post(fullUrl, data, {
            headers: {
                'Content-MD5': md5Data,
                Authorization: apiAuth,
                date: date
            }
        })
        console.log(JSON.stringify(postData.data, null, 2))
        // console.log(postData.data.data.records.map((val) => {
        //     return _.pick(val, ['fullHour', 'capacity', 'power', 'dayEnergy'])
        // }))
    }    
    // setInterval(getData, 1000 * 60)
    getData()
}

test()