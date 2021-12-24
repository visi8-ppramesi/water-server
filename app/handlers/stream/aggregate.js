const StreamHandler = require('./utils/streamHandler.js')

class AggregateStreamHandler extends StreamHandler{
    constructor(){
        super()
    }

    functionOne(args){
        console.log(args)
    }

    static factory(){
        const aggregateStreamHandler = new AggregateStreamHandler()
        const functionNames = Object.getOwnPropertyNames(AggregateStreamHandler.prototype).filter(name => name !== 'constructor')
        
        functionNames.forEach((name) => {
            console.log(name)
            aggregateStreamHandler.pushFunction(aggregateStreamHandler[name].bind(aggregateStreamHandler))
        })

        return aggregateStreamHandler
    }
}

module.exports = AggregateStreamHandler.factory()