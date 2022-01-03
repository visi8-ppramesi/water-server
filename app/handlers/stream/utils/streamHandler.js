class StreamHandler{
    constructor(){
        this.pipe = []
    }

    register(func){
        this.pipe.push(func)
    }

    invoker(){
        let self = this
        return function(data){
            let prevResult
            for(let i = 0; i < self.pipe.length; i++){
                const params = {data, prevResult, arguments}
                prevResult = self.pipe[i](params)
            }
            return prevResult
        }
    }

    static streamHandlerFactory(handlerObj){
        const aggregateStreamHandler = new handlerObj()
        const functionNames = Object.getOwnPropertyNames(handlerObj.prototype).filter(name => name !== 'constructor')
        
        functionNames.forEach((name) => {
            aggregateStreamHandler.register(aggregateStreamHandler[name].bind(aggregateStreamHandler))
        })

        return aggregateStreamHandler
    }
}

module.exports = StreamHandler