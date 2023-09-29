const nodemailer = require('nodemailer');
const CONFIG = require('../../config');

// Function to create the transporter
const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.SYSTEM_GMAIL,
      pass: CONFIG.SYSTEM_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    return transporter; // Return the transporter if successful
  } catch (err) {
    console.error('Node Mailer connection failed:', err.message);
    return null; // Return null if connection fails
  }
};

// Function to establish a mail transporter with retries
const establishMailTransporterWithRetry = async () => {
  let transporter = null;
  let retries = 3; // Number of connection retries

  while (retries > 0 && !transporter) {
    transporter = await createTransporter();
    if (!transporter) {
      console.log(`Retrying in 5 seconds... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      retries--;
    }
  }

  if (!transporter) {
    console.error('Max retries reached. Unable to establish Node Mailer connection.');
  }

  return transporter;
};

// Usage
const main = async () => {
  const mailTransporter = await createTransporter();
  if (mailTransporter) {
    console.log('Node mailer is configured.')
  } else {
    console.error('Unable to establish a working Node Mailer connection.');
  }
};

main();

module.exports.establishMailTransporterWithRetry = establishMailTransporterWithRetry
