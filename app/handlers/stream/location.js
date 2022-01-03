const StreamHandler = require('./utils/streamHandler.js')

class LocationStreamHandler extends StreamHandler{
    constructor(){
        super()
    }

    functionOne(args){
        console.log(args.data)
    }

    // static factory(){
    //     const locationStreamHandler = new LocationStreamHandler()
    //     const functionNames = Object.getOwnPropertyNames(LocationStreamHandler.prototype).filter(name => name !== 'constructor')
        
    //     functionNames.forEach((name) => {
    //         locationStreamHandler.register(locationStreamHandler[name].bind(locationStreamHandler))
    //     })

    //     return locationStreamHandler
    // }
}

module.exports = StreamHandler.streamHandlerFactory(LocationStreamHandler)
// module.exports = LocationStreamHandler.factory()