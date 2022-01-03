const FlowdataService = require('../services/flowdata');
const ErrorHelper = require('../helpers/error');

module.exports = {

	list: (req, res) => {
		FlowdataService
			.list(req.query)
			.then(data => res.status(200).json({ success: true, data }))
			.catch(err => ErrorHelper.response(res, err));
	},

	create: (req, res) => {
		FlowdataService
			.create(req.body)
			.then(data => {
				// req.socket.emit('flowdata-added', data)
				res.status(200).json({ success: true, data }
			)})
			.catch(err => ErrorHelper.response(res, err));
	},

	findById: (req, res) => {
		FlowdataService
			.findById(req.params.id)
			.then(data => res.status(200).json({ success: true, data }))
			.catch(err => ErrorHelper.response(res, err));
	},

	update: (req, res) => {
		FlowdataService
			.update(req.params.id, req.body)
			.then(() => res.status(200).json({ success: true }))
			.catch(err => ErrorHelper.response(res, err));
	},

	delete: (req, res) => {
		FlowdataService
			.delete(req.params.id)
			.then(() => res.status(200).json({ success: true }))
			.catch(err => ErrorHelper.response(res, err));
	},
};
