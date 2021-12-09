module.exports.flowdataProcessor = (flowdata) => {
    let minDate = +(new Date())
    let maxDate = 0
    flowdata.sort((a, b) => {
        return a.timestamp - b.timestamp
    })
    const total = flowdata.reduce((acc, val, idx) => {
        if(minDate > val.timestamp){
            minDate = val.timestamp
        }
        if(maxDate < val.timestamp){
            maxDate = val.timestamp
        }
        if(flowdata.length > idx + 1){
            acc += val.flowRate * ((flowdata[idx + 1].timestamp - val.timestamp) / (1000 * 60 * 60))
        }
        return acc
    }, 0)
    const dateSpan = maxDate - minDate
    const averageHour = (total / dateSpan) * 1000 * 60 * 60
    return {
        minDate,
        maxDate,
        total,
        average: {
            hour: averageHour
        }
    }
}