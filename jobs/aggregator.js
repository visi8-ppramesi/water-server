const db = require('../config/database.js')
const locationModel = require('../app/models/location.js')
const flowdata = require('../app/models/flowdata.js')
const aggregate = require('../app/models/aggregate.js')
const _ = require('lodash')
const { performance } = require('perf_hooks')

db()

const dateRounder = (date, rounder) => {
    return Math.floor(date / rounder) * rounder
}

const now = (new Date())

const todayStart = dateRounder(+(new Date(now.getFullYear(), now.getMonth(), now.getDate())), 1000 * 60 * 60)
const todayEnd = dateRounder(+(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)), 1000 * 60 * 60)

const thisMonthStart = dateRounder(+(new Date(now.getFullYear(), now.getMonth(), 1)), 1000 * 60 * 60 * 24)
const thisMonthEnd = dateRounder(+(new Date(now.getFullYear(), now.getMonth() + 1, 1)), 1000 * 60 * 60 * 24)

const thisYearStart = dateRounder(+(new Date(now.getFullYear(), 0, 1)), 1000 * 60 * 60 * 24)
const thisYearEnd = dateRounder(+(new Date(now.getFullYear() + 1, 0, 1)), 1000 * 60 * 60 * 24)

function aggregateData(data){//accepts sorted flowdatas
    let total = 0
    for(let i = 0; i < data.length - 1; i++){
        const startFlowdata = data[i]
        const endFlowdata = data[i + 1]
        const base = Math.min(endFlowdata.flowRate, startFlowdata.flowRate)
        const flowRateDiff = Math.abs(endFlowdata.flowRate - startFlowdata.flowRate)
        const timestampDiff = (endFlowdata.timestamp - startFlowdata.timestamp) / (1000 * 60)
        const volumeFlow = (base + flowRateDiff) * timestampDiff
        total += volumeFlow
    }
    return total
}

function aggregatorFactory(data, bucketSize, type){
    const retVal = {}
    const bucketed = _.groupBy(data, (val) => {
        return Math.floor(val.timestamp / bucketSize) * bucketSize
    })
    
    const aggregatedUnfilled = Object.keys(bucketed).reduce((acc, date) => {
        const sorted = [...bucketed[date]].sort((a, b) => {
            return a.timestamp - b.timestamp
        })
        acc[date] = aggregateData(sorted)
        return acc
    }, {})

    const bucketDates = Object.keys(aggregatedUnfilled)
    // const start = Math.min(...bucketDates)
    const start = type == 'daily' ? todayStart :
        type == 'monthly' ? thisMonthStart :
        type == 'yearly' ? thisYearStart : null
    // const end = Math.max(...bucketDates)
    const end = type == 'daily' ? todayEnd :
        type == 'monthly' ? thisMonthEnd :
        type == 'yearly' ? thisYearEnd : null
    let lastValue = 0
    for(let i = start; i < end; i += bucketSize){
        if(aggregatedUnfilled[i]){
            retVal[i] = aggregatedUnfilled[i]
            lastValue = aggregatedUnfilled[i]
        }else{
            retVal[i] = lastValue
        }
    }
    return retVal
}

const curriedAggregatorFactory = async ({location = null, start, end, bucket}, type) => {
    let result
    if(location){
        result = await flowdata.find({ location, timestamp: { $gt: start, $lt: end }}).sort('timestamp').exec()
    }else{
        result = await flowdata.find({ timestamp: { $gt: start, $lt: end }}).sort('timestamp').exec()
    }
    return { aggregated: aggregatorFactory(result, bucket, type), result }
}

const getFlowdata = async (location, start, end) => {
    if(location){
        return await flowdata.find({ location, timestamp: { $gt: start, $lt: end }}).sort('timestamp').exec()
    }else{
        return await flowdata.find({ timestamp: { $gt: start, $lt: end }}).sort('timestamp').exec()
    }
}

const aggregateLocation = async (location) => {
    const flowdata = await getFlowdata(location, thisYearStart, thisYearEnd)
    const aggrData = aggregatorFactory(flowdata, 1000 * 60 * 60, 'yearly')

    const aggregateDaily = _.chain(aggrData)
        .map((value, prop) => {
            return { value, prop }
        })
        .groupBy((obj) => {
            const myDate = new Date(parseInt(obj.prop))
            return +(new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()))
        })
        .reduce((acc, value, key) => {
            acc[key] = _.reduce(value, (innerAcc, innerVal) => {
                innerAcc[innerVal.prop] = innerVal.value
                return innerAcc
            }, {})
            return acc
        }, {})
        .value()

    const aggregateMonthly = _.chain(aggrData)
        .map((value, prop) => {
            return { value, prop }
        })
        .groupBy((obj) => {
            const myDate = new Date(parseInt(obj.prop))
            return +(new Date(myDate.getFullYear(), myDate.getMonth()))
        })
        .reduce((acc, value, key) => {
            acc[key] = _.chain(value)
                .groupBy((obj) => {
                    const myDate = new Date(parseInt(obj.prop))
                    return +(new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()))
                })
                .reduce((innerAcc, innerValue, innerKey) => {
                    innerAcc[innerKey] = innerValue.reduce((innerInnerAcc, v) => {
                        innerInnerAcc += v.value
                        return innerInnerAcc
                    }, 0)
                    return innerAcc
                }, {})
                .value()
            return acc
        }, {})
        .value()

    const aggregateYearly = _.chain(aggrData)
        .map((value, prop) => {
            return { value, prop }
        })
        .groupBy((obj) => {
            const myDate = new Date(parseInt(obj.prop))
            return +(new Date(myDate.getFullYear(), myDate.getMonth()))
        })
        .reduce((acc, value, key) => {
            acc[key] = value.reduce((innerAcc, v) => {
                innerAcc += v.value
                return innerAcc
            }, 0)
            return acc
        }, {})
        .value()

    return { aggregateDaily, aggregateMonthly, aggregateYearly }
    // process.exit(0)


    // const { aggregated: aggregateDaily, result: resultDaily } = await curriedAggregatorFactory({ location, start: todayStart, end: todayEnd, bucket: 1000 * 60 * 60 }, 'daily')
    // let { aggregated: aggregateMonthly, result: resultMonthly } = await curriedAggregatorFactory({ location, start: thisMonthStart, end: thisMonthEnd, bucket: 1000 * 60 * 60 }, 'monthly')
    // aggregateMonthly = _.chain(aggregateMonthly)
    //     .map((value, prop) => {
    //         return { value, prop }
    //     })
    //     .groupBy((obj) => {
    //         const myDate = new Date(parseInt(obj.prop))
    //         return +(new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()))
    //     })
    //     .reduce((acc, value, key) => {
    //         acc[key] = value.reduce((innerAcc, v) => {
    //             innerAcc += v.value
    //             return innerAcc
    //         }, 0)
    //         return acc
    //     }, {})
    //     .value()

    // let { aggregated: aggregateYearly, result: resultYearly } = await curriedAggregatorFactory({ location, start: thisYearStart, end: thisYearEnd, bucket: 1000 * 60 * 60 }, 'yearly')

    // aggregateYearly = _.chain(aggregateYearly)
    //     .map((value, prop) => {
    //         return { value, prop }
    //     })
    //     .groupBy((obj) => {
    //         const myDate = new Date(parseInt(obj.prop))
    //         return +(new Date(myDate.getFullYear(), myDate.getMonth()))
    //     })
    //     .reduce((acc, value, key) => {
    //         acc[key] = value.reduce((innerAcc, v) => {
    //             innerAcc += v.value
    //             return innerAcc
    //         }, 0)
    //         return acc
    //     }, {})
    //     .value()
    
    // return { aggregateDaily, aggregateMonthly, aggregateYearly }
}

(async () => {
    const startTime = performance.now()
    let locations = (await locationModel.find({})).map(v => v._id.toString())
    // locations = [null, ...locations.map(v => v._id.toString())]
    const allLocsAggrPromise = locations.reduce((acc, loc) => {
        // const locName = loc ? loc : 'global'
        acc[loc] = aggregateLocation(loc)
        return acc
    }, {})

    const changeDate = (v) => {
        return _.reduce(v, (acc, val, prop) => {
            acc[new Date(parseInt(prop)).toLocaleString('id-ID')] = val

            return acc
        }, {})
    }

    const result = await Promise.all(Object.values(allLocsAggrPromise))
    const zipped = _.zipObject(Object.keys(allLocsAggrPromise), result)
    const processedData = _.reduce(zipped, (acc, value, key) => {
        const aggrDailyValues = Object.keys(value.aggregateDaily).map((dayKey) => {
            return {
                location: key,
                name: 'aggregateDaily',
                timestamp: +(new Date(parseInt(dayKey))),
                data: changeDate(value.aggregateDaily[dayKey])
            }
        })
        const aggrMonthlyValues = Object.keys(value.aggregateMonthly).map((moKey) => {
            return {
                location: key,
                name: 'aggregateMonthly',
                timestamp: +(new Date(parseInt(moKey))),
                data: changeDate(value.aggregateMonthly[moKey])
            }
        })
        const aggrYearlyKeys = Object.keys(value.aggregateYearly)

        const newData = [
            ...aggrDailyValues,
            ...aggrMonthlyValues,
            // {
            //     location: key,
            //     name: 'aggregateDaily',
            //     timestamp: +(new Date(parseInt(aggrDailyKeys[0]))),
            //     data: changeDate(value.aggregateDaily)
            // },
            // {
            //     location: key,
            //     name: 'aggregateMonthly',
            //     timestamp: +(new Date(parseInt(aggrMonthlyKeys[0]))),
            //     data: changeDate(value.aggregateMonthly)
            // },
            {
                location: key,
                name: 'aggregateYearly',
                timestamp: +(new Date(parseInt(aggrYearlyKeys[0]))),
                data: changeDate(value.aggregateYearly)
            }
        ]

        acc.push(...newData)

        return acc
    }, [])
    
    for(let i = 0; i < processedData.length; i++){
        const aggrData = processedData[i]
        let newData = await aggregate.findOneAndUpdate({
            location: aggrData.location,
            name: aggrData.name,
            date: aggrData.timestamp,
        }, { data: aggrData.data }, { upsert: true, new: true })
    }
    
    // ([null, ...locations]).forEach((loc) => {
    //     console.log(loc)
    // })
    // const aggregateDaily = await curriedAggregatorFactory({start: todayStart, end: todayEnd, bucket: 1000 * 60 * 60})
    // const aggregateMonthly = await curriedAggregatorFactory({start: thisMonthStart, end: thisMonthEnd, bucket: 1000 * 60 * 60 * 24})
    // let aggregateYearly = await curriedAggregatorFactory({start: thisYearStart, end: thisYearEnd, bucket: 1000 * 60 * 60 * 24})
    // aggregateYearly = _.chain(aggregateYearly)
    //     .map((value, prop) => {
    //         return { value, prop }
    //     })
    //     .groupBy((obj) => {
    //         const myDate = new Date(parseInt(obj.prop))
    //         return +(new Date(myDate.getFullYear(), myDate.getMonth()))
    //     })
    //     .reduce((acc, value, key) => {
    //         acc[key] = value.reduce((innerAcc, v) => {
    //             innerAcc += v.value
    //             return innerAcc
    //         }, 0)
    //         return acc
    //     }, {})
    //     .value()
        

    // var endTime = performance.now()

    // console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    
    // console.log({ aggregateDaily, aggregateMonthly, aggregateYearly })
    // console.log([ aggregateDaily, aggregateMonthly, aggregateYearly ].map(v => Object.keys(v).map(b => new Date(parseInt(b)))))
    process.exit(0)
})()
