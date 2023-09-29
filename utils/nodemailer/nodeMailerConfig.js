const nodemailer = require('nodemailer');
const CONFIG = require('../../config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.SYSTEM_GMAIL,
    pass: CONFIG.SYSTEM_PASSWORD,
  },
})

transporter.verify().then(res=>{
    if(res) console.log('Node Mailer is configured!')
    else console.log('Node Mailer is not configured properly. The subscribers will not be recieving emails')
}).catch(err=>{
    console.log('Node Mailer is not configured properly. The subscribers will not be recieving emails')
    console.error(err)
})

module.exports.mailTransporter = transporter;
