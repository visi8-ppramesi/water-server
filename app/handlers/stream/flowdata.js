const StreamHandler = require('./utils/streamHandler.js')

class FlowdataStreamHandler extends StreamHandler{
    constructor(){
        super()
    }

    functionOne(args){
        console.log(args.data)
    }

    // static factory(){
    //     const flowdataStreamHandler = new FlowdataStreamHandler()
    //     const functionNames = Object.getOwnPropertyNames(FlowdataStreamHandler.prototype).filter(name => name !== 'constructor')
        
    //     functionNames.forEach((name) => {
    //         flowdataStreamHandler.register(flowdataStreamHandler[name].bind(flowdataStreamHandler))
    //     })

    //     return flowdataStreamHandler
    // }
}

module.exports = StreamHandler.streamHandlerFactory(FlowdataStreamHandler)
// module.exports = FlowdataStreamHandler.factory()