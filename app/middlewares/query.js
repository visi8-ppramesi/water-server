const queryBuilder = require('../../utils/queryBuilder.js')

module.exports = (req, res, next) => {
    req.query.limit = Number(req.query.limit) || 0;
    req.query.skip = Number(req.query.skip) || 0;
    const ascOrDesc = req.query.asc ? 1 : req.query.desc ? -1 : null
    req.query.sort = ascOrDesc ? {[req.query.sort]: ascOrDesc} : '';
    req.query.find = queryBuilder(req.query)
    next();
};
