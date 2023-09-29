const CONFIG = require("./config");
const express = require("express");
require("./database"); // initialize db

const standardizeResponse = require("./middlewares/standardizeResponse");
const errorHandler = require("./middlewares/errorHandler");

require("./cronjobs/clean_stale_mixer_request")();
require("./cronjobs/retry_outbox")();

const app = express();
app.use(require("cors")({ origin: "*" }));
app.use(express.json());
app.use(standardizeResponse);

app.use("/api", require("./routes"));

app.use(express.static("public"));
app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api")) next(); // exclude api routes
  try {
    res.sendFile(require("path").join(__dirname, "public", "index.html"));
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

app.listen(CONFIG.PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${CONFIG.PORT}`
  );
});
