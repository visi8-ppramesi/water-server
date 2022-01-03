const StreamHandler = require('./utils/streamHandler.js')

class AggregateStreamHandler extends StreamHandler{
    constructor(){
        super()
    }

    functionOne(args){
        console.log(args.data)
    }

    // static factory(){
    //     const aggregateStreamHandler = new AggregateStreamHandler()
    //     const functionNames = Object.getOwnPropertyNames(AggregateStreamHandler.prototype).filter(name => name !== 'constructor')
        
    //     functionNames.forEach((name) => {
    //         aggregateStreamHandler.register(aggregateStreamHandler[name].bind(aggregateStreamHandler))
    //     })

    //     return aggregateStreamHandler
    // }
}

module.exports = StreamHandler.streamHandlerFactory(AggregateStreamHandler)
// module.exports = AggregateStreamHandler.factory()