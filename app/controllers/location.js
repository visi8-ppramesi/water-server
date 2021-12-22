const LocationService = require('../services/location');
const ErrorHelper = require('../helpers/error');

module.exports = {

	ping: (req, res) => {
		LocationService
			.ping(req.params.id, req.body.status)
			.then(data => res.status(200).json({ success: true, data }))
			.catch(err => ErrorHelper.response(res, err))
	},

	list: (req, res) => {
		LocationService
			.list(req.query)
			.then(data => res.status(200).json({ success: true, data }))
			.catch(err => ErrorHelper.response(res, err));
	},

	listWithFlowdata: (req, res) => {
		LocationService
			.listWithFlowdata(req.body)
			.then(data => {
				res.status(200).json({ success: true, data })
			})
			.catch(err => ErrorHelper.response(res, err));
	},

	findWithFlowdata: (req, res) => {
		LocationService
			.findWithFlowdata(req.params.id, req.body)
			.then(data => res.status(200).json({ success: true, data }))
			.catch(err => ErrorHelper.response(res, err));
	},

	create: (req, res) => {
		LocationService
			.create(req.body)
			.then(data => {
				req.socket.emit('location-added', data)
				res.status(200).json({ success: true, data }
			)})
			.catch(err => ErrorHelper.response(res, err));
	},

	findById: (req, res) => {
		LocationService
			.findById(req.params.id)
			.then(data => res.status(200).json({ success: true, data }))
			.catch(err => ErrorHelper.response(res, err));
	},

	update: (req, res) => {
		LocationService
			.update(req.params.id, req.body)
			.then(() => res.status(200).json({ success: true }))
			.catch(err => ErrorHelper.response(res, err));
	},

	delete: (req, res) => {
		LocationService
			.delete(req.params.id)
			.then(() => res.status(200).json({ success: true }))
			.catch(err => ErrorHelper.response(res, err));
	},
};
