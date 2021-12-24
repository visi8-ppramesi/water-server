class StreamHandler{
    constructor(){
        this.pipe = []
    }

    pushFunction(func){
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
}

module.exports = StreamHandler