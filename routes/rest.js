var express = require('express');
var router = express.Router();

router.get('/read', function(req, res, next) {
  let params = ['bundle_id']
  let bundleId = req.query[params[0]];

  if(!bundleId){
    res.status(400).json({ message: `request requires ${params}`});
    return;
  }

  req.db.get('builds').findOne({ bundleId: bundleId }).then(function (build) {
    if(!build || !build.buildNumber){
      res.status(404).json({ message: `no build found for bundleId: ${bundleId}`});
      return;
    }
    res.send(build.buildNumber.toString());
  }, function(error){
    res.status(500).json({error: error});
  })
});

router.post('/set', function(req, res, next) {
  let params = ['bundle_id', 'new_build_number']
  let bundleId = req.query[params[0]];
  let newBuildNumber = parseInt(req.query[params[1]]) || 0;

  if(!bundleId){
    res.status(400).json({ message: `request requires ${params}`});
    return;
  }

  req.db.get('builds').update({ bundleId: bundleId}, { $max: { buildNumber: newBuildNumber } }, {upsert: true}).then(function (build) {
    res.sendStatus(200);
  }, function(error){
    res.status(500).json({error: error});
  })
});

router.post('/bump', function(req, res, next) {
  let params = ['bundle_id']
  let bundleId = req.query[params[0]];

  if(!bundleId){
    res.status(400).json({ message: `request requires ${params}`});
    return;
  }

  req.db.get('builds').findOneAndUpdate({ bundleId: bundleId}, { $inc: { buildNumber: 1 } }, {upsert: true}).then(function (build) {
    res.send(build.buildNumber.toString());
  }, function (error) {
    res.status(500).json({error: error});
  })
});

module.exports = router;
