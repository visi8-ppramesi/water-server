const innerAssign = (obj, name, innerObj, innerName) => {
    if(obj[name]){
        obj[name][innerName] = innerObj
    }else{
        obj[name] = {
            [innerName]: innerObj
        }
    }
}

module.exports = (query) => {
    const retVal = {}
    if(query.location) retVal.location = query.location
    if(query.dategt) innerAssign(retVal, 'date', query.dategt, '$gt')
    if(query.datelt) innerAssign(retVal, 'date', query.datelt, '$lt')
    if(query.timestampgt) innerAssign(retVal, 'timestamp', query.timestampgt, '$gt')
    if(query.timestamplt) innerAssign(retVal, 'timestamp', query.timestamplt, '$lt')
    return retVal
}