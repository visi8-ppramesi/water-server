const AggregateService = require('../services/aggregate.js');
const ErrorHelper = require('../helpers/error');

module.exports = {

	findAggregate: (req, res) => {
		AggregateService
			.findAggregate(req.params)
			.then(data => res.status(200).json({ success: true, data }))
			.catch(err => ErrorHelper.response(res, err));
	},

	findDates: (req, res) => {
		AggregateService
			.findDates(req.params, req.body)
			.then(data => res.status(200).json({ success: true, data }))
			.catch(err => ErrorHelper.response(res, err));
	},
};
