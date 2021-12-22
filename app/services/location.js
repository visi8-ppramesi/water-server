const Model = require('../models/location.js');
const flowdataProcessor = require('../../utils/flowdataProcessor.js').flowdataProcessor

const _findOne = (criteria = {}) => new Promise((resolve, reject) => {
  Model
    .findOne(criteria)
    .then((data) => {
      if (!data) return reject({ success: false, message: 'Not found', status: 404 });
      resolve(data);
    })
    .catch(reject);
});

const _findById = _id => _findOne({ _id });

const _update = (criteria = {}, body) => Model.update(criteria, { $set: body });

const _delete = (criteria = {}) => Model.remove(criteria);

module.exports = {

  ping: (_id, status) => new Promise((resolve, reject) => {
    _findById(_id)
        .then(() => {
            Model.updateOne({ _id }, { $set: {
                locationStatus: status,
                lastStatusTimestamp: +(new Date())
            }}).then(resolve).catch(reject)
        })
        .catch(reject)
  }),

  list: (query = {}) => {
      const { limit, skip, sort, find } = query;
      return Model
          .find(find)
          .limit(limit)
          .skip(skip)
          .sort(sort);
  },

  listWithFlowdata: (body) => {
      const { limit, skip, sort, find, popMatch } = body;
      return Model
          .find(find)
          .limit(limit)
          .skip(skip)
          .sort(sort)
          .populate({ path: 'flowdata', match: popMatch })
          .lean()
          .then((data) => {
            let modData = [...data]
            for(let idx = 0; idx < modData.length; idx++){
              const loc = data[idx]
              const processedData = flowdataProcessor(loc.flowdata)
              Object.keys(processedData).forEach((procKey) => {
                modData[idx][procKey] = processedData[procKey]
              })
            }
            return modData
          });
  },

  findWithFlowdata: (_id, body) => {
      const { popMatch } = body;
      return Model
          .findOne({ _id })
          .populate({ path: 'flowdata', match: popMatch });
  },

  create: (body = {}) => {
      const model = new Model(body);
      model.geocoordinate = body.geocoordinate
      model.address = body.address
      model.name = body.name
      if(body.parent){
        model.parent = body.parent
      }
      return model.save()
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
