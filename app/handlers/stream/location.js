const StreamHandler = require('./utils/streamHandler.js')

class LocationStreamHandler extends StreamHandler{
    constructor(){
        super()
    }

    functionOne(args){
        console.log(args)
    }

    static factory(){
        const locationStreamHandler = new LocationStreamHandler()
        const functionNames = Object.getOwnPropertyNames(LocationStreamHandler.prototype).filter(name => name !== 'constructor')
        
        functionNames.forEach((name) => {
            console.log(name)
            locationStreamHandler.pushFunction(locationStreamHandler[name].bind(locationStreamHandler))
        })

        return locationStreamHandler
    }
}

module.exports = LocationStreamHandler.factory()