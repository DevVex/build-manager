let express = require('express');
let router = express.Router();
let {name, version} = require('../package.json');

router.get('/version', (req, res, next) => {
  res.status(200).json({name: name, version: version});
})

router.get('/builds', (req, res, next) => {
  req.db.get('builds').find({}).then((result) => {
    res.status(200).json(result);
  }, function(error){
    console.error('error:', error);
    res.status(500).json({error: error});
  })
});

router.get('/read', (req, res, next) => {
  let params = ['bundle_id']
  let bundleId = req.query[params[0]];

  if(!bundleId){
    res.status(400).json({ message: `request requires ${params}`});
    return;
  }

  req.db.get('builds').findOne({ bundleId: bundleId }).then((build) => {
    if(!build || typeof build.buildNumber === undefined){
      res.status(404).json({ message: `no build found for bundleId: ${bundleId}`});
      return;
    }
    res.send(build.buildNumber.toString());
  }, function(error){
    console.error('error:', error);
    res.status(500).json({error: error});
  })
});

router.post('/set', (req, res, next) => {
  let params = ['bundle_id', 'new_build_number']
  let bundleId = req.query[params[0]];
  let newBuildNumber = parseInt(req.query[params[1]]) || 0;

  if(!bundleId){
    res.status(400).json({ message: `request requires ${params[0]}`});
    return;
  }

  req.db.get('builds').update({ bundleId: bundleId}, { $max: { buildNumber: newBuildNumber } }, {upsert: true}).then((build) => {
    res.status(200).json({});
  }, function(error){
    console.error('error:', error);
    res.status(500).json({error: error});
  })
});

router.post('/bump', (req, res, next) => {
  let params = ['bundle_id']
  let bundleId = req.query[params[0]];

  if(!bundleId){
    res.status(400).json({ message: `request requires ${params}`});
    return;
  }

  req.db.get('builds').findOneAndUpdate({ bundleId: bundleId}, { $inc: { buildNumber: 1 } }, {upsert: true}).then((build) => {
    res.send(build.buildNumber.toString());
  }, function (error) {
    console.error('error:', error);
    res.status(500).json({error: error});
  })
});

module.exports = router;
