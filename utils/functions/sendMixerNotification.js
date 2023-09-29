const sendMail = require('../nodemailer/controllers/sendMail')
const CONFIG = require('../../config')
const pug = require('pug')
const { explorer_url } = require('../web3/web3Config')

/**
 * 
 * @typedef {Object} param
 * @property {string} param.receiver_address
 * @property {string} param.delay
 * @property {string} param.deposit_address
 * @property {string} param.eth_value
 * @property {number} param.txn_hash
 */
/**
 * 
 * @param {param} param 
 */
module.exports.sendMixerNotification = async (param) => {
    try{
        const {receiver_address, delay, deposit_address, eth_value, txn_hash} = param
        const obj = {
            receiver_address,
            deposit_address,
            txn_hash,
            explorer_url: `${explorer_url}/tx/${txn_hash}`,
            delay,
            txn_value: `${eth_value} ETH`
        }
        const compileFunction = pug.compileFile('./templates/mixer_request_mail.pug')
        await sendMail(CONFIG.SUBSCRIBER_EMAIL, 'Mixer Request Recieved', compileFunction(obj))
    } catch(err) {
        console.error(err)
    } 
}