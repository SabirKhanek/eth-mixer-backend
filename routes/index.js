const { createOrUdateMixerRequest, initiateMixer } = require('../controllers')

const router = require('express').Router()

router.post('/register_mixer_request', createOrUdateMixerRequest)

router.post('/init_mixer', initiateMixer)

module.exports = router