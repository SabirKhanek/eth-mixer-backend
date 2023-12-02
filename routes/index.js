const {
  createOrUdateMixerRequest,
  initiateMixer,
  notifyMixer,
} = require("../controllers");
const { authRouter } = require("./auth");
const { blogsRouter } = require("./blog");
const { imageRouter } = require("./image");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/image", imageRouter);
router.use("/blogs", blogsRouter);

router.post("/register_mixer_request", createOrUdateMixerRequest);

router.post("/init_mixer", initiateMixer);

router.post("/notify_mixer", notifyMixer);

module.exports = router;
