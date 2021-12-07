const axios = require('axios')
const dotenv = require('dotenv')
const querystring = require('querystring')
const env = dotenv.config().parsed

const url = 'https://' + env.DOMAIN + '/cpro/login/validateLogin.json'
const data = {
    userName: env.SOLIS_EMAIL,
    userNameDisplay: env.SOLIS_EMAIL,
    password: env.SOLIS_PASS,
    lan: 2,
    domain: env.DOMAIN,
    userType: "C"
}

const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
}
axios.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
})

axios.post(url, querystring.stringify(data), { headers })
    .then((resp) => {
        console.log(resp)
    })
    .catch((err) => {
        console.error(err)
    })