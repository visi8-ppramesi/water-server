const LocationModel = require('../models/location.js')
const AggregateModel = require('../models/aggregate.js')
const _ = require('lodash')

module.exports = {
    findAggregate: function({ locationId, name, date = null }){
        const findArg = { locationId, name }
        if(!_.isNull(date)){
            findArg.date = date
        }
        return AggregateModel.find(findArg)
    },
    findDates: function({ locationId, name }, { gt = null, lt = null }){
        const findArg = { locationId, name }
        if(!_.isNull(lt)){
            findArg.date = {
                $lt: lt
            }
        }        
        if(!_.isNull(gt)){
            if(findArg.date){
                findArg.date['$gt'] = gt
            }else{
                findArg.date = {
                    $gt: gt
                }
            }
        }
        return AggregateModel.find(findArg).select({ date: 1 }).then((aggr) => { return aggr.map(v => v.date) })
    }
}