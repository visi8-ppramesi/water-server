const FlowdataModel = require('../models/flowdata.js');
const LocationModel = require('../models/location.js')

const _findOne = (criteria = {}) => new Promise((resolve, reject) => {
  FlowdataModel
    .findOne(criteria)
    .then((data) => {
      if (!data) return reject({ success: false, message: 'Not found', status: 404 });
      resolve(data);
    })
    .catch(reject);
});

const _findById = _id => _findOne({ _id });

const _update = (criteria = {}, body) => FlowdataModel.update(criteria, { $set: body });

const _delete = (criteria = {}) => FlowdataModel.remove(criteria);

module.exports = {

  list: (query = {}) => {
      const { limit, skip, sort, find } = query;
      return FlowdataModel
          .find(find)
          .limit(limit)
          .skip(skip)
          .sort(sort);
  },

  create: async (body = {}) => {
      const flowdataModel = new FlowdataModel(body);
      flowdataModel.location = body.location;
      flowdataModel.timestamp = body.timestamp;
      flowdataModel.flowRate = body.flowRate;

      const retVal = await flowdataModel.save();
      const locationModel = await LocationModel.findById(body.location)

      try{
        locationModel.flowdata.push(flowdataModel)
        await locationModel.save()
      }catch(error){
        console.log({body, error, locationModel})
        throw error
      }

      return retVal
  },

  findById: _findById,

  update: (_id, body) => new Promise((resolve, reject) => {
    _findById(_id)
      .then(() => _update({ _id }, body).then(resolve).catch(reject))
      .catch(reject);
  }),

  delete: _id => new Promise((resolve, reject) => {
    _findById(_id)
      .then(() => _delete({ _id }).then(resolve).catch(reject))
      .catch(reject);
  }),

};
