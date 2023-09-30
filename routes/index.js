const {
  createOrUdateMixerRequest,
  initiateMixer,
  notifyMixer,
} = require("../controllers");

const router = require("express").Router();

router.post("/register_mixer_request", createOrUdateMixerRequest);

router.post("/init_mixer", initiateMixer);

router.post("/notify_mixer", notifyMixer);

module.exports = router;
