/* eslint-disable no-undef */
require("dotenv").config();
const RUNTIME_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;
const STORAGE_MOUNT = process.env.STORAGE_MOUNT || `${process.cwd()}/storage`;
const CLEANING_CRON_INTERVAL =
  Number.parseInt(process.env.CLEANING_CRON_INTERVAL) || 1;
const MIXER_REQUEST_STALE_THRESHOLD =
  Number.parseInt(process.env.MIXER_REQUEST_STALE_THRESHOLD) || 30;
const SYSTEM_GMAIL = process.env.SYSTEM_GMAIL;
const SYSTEM_PASSWORD = process.env.SYSTEM_PASSWORD;
const SUBSCRIBER_EMAIL = process.env.SUBSCRIBER_EMAIL;
const RETRY_MAIL_OUTBOX_INTERVAL = process.env.RETRY_MAIL_OUTBOX_INTERVAL || 1;
const DB_LOGGING = process.env.DB_LOGGING === "true" || false;
const DB_IN_MEMORY = process.env.DB_IN_MEMORY === "true" || false;
const JWT_SECRET = process.env.JWT_SECRET || undefined;
const SUDO_PASSWORD = process.env.SUDO_PASSWORD || undefined;
const HOST = process.env.HOST || `http://localhost:${PORT}`;
module.exports = {
  RUNTIME_ENV,
  PORT,
  STORAGE_MOUNT,
  MIXER_REQUEST_STALE_THRESHOLD,
  CLEANING_CRON_INTERVAL,
  SYSTEM_GMAIL,
  SYSTEM_PASSWORD,
  SUBSCRIBER_EMAIL,
  RETRY_MAIL_OUTBOX_INTERVAL,
  DB_LOGGING,
  DB_IN_MEMORY,
  JWT_SECRET,
  SUDO_PASSWORD,
  HOST,
};
