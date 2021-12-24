const StreamHandler = require('./utils/streamHandler.js')

class FlowdataStreamHandler extends StreamHandler{
    constructor(){
        super()
    }

    functionOne(args){
        console.log(args)
    }

    static factory(){
        const flowdataStreamHandler = new FlowdataStreamHandler()
        const functionNames = Object.getOwnPropertyNames(FlowdataStreamHandler.prototype).filter(name => name !== 'constructor')
        
        functionNames.forEach((name) => {
            console.log(name)
            flowdataStreamHandler.pushFunction(flowdataStreamHandler[name].bind(flowdataStreamHandler))
        })

        return flowdataStreamHandler
    }
}

module.exports = FlowdataStreamHandler.factory()