const StreamHandler = require('./utils/streamHandler.js')

class UserStreamHandler extends StreamHandler{
    constructor(){
        super()
    }

    functionOne(args){
        console.log(args)
    }

    static factory(){
        const userStreamHandler = new UserStreamHandler()
        const functionNames = Object.getOwnPropertyNames(UserStreamHandler.prototype).filter(name => name !== 'constructor')
        
        functionNames.forEach((name) => {
            console.log(name)
            userStreamHandler.pushFunction(userStreamHandler[name].bind(userStreamHandler))
        })

        return userStreamHandler
    }
}

module.exports = UserStreamHandler.factory()