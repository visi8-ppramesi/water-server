const StreamHandler = require('./utils/streamHandler.js')

class UserStreamHandler extends StreamHandler{
    constructor(){
        super()
    }

    functionOne(args){
        console.log(args.data)
    }

    // static factory(){
    //     const userStreamHandler = new UserStreamHandler()
    //     const functionNames = Object.getOwnPropertyNames(UserStreamHandler.prototype).filter(name => name !== 'constructor')
        
    //     functionNames.forEach((name) => {
    //         userStreamHandler.register(userStreamHandler[name].bind(userStreamHandler))
    //     })

    //     return userStreamHandler
    // }
}

module.exports = StreamHandler.streamHandlerFactory(UserStreamHandler)
// module.exports = UserStreamHandler.factory()