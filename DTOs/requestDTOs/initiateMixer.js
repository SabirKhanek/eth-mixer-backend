const Joi = require('joi')


/**
 * @typedef {Object} initiateMixerRequestValue
 * @property {string} receiver_address
 * @property {string} txn_hash
 */

/**
 * @typedef {Object} InitiateMixerRequestDTOType
 * @property {(value: any) => {value: initiateMixerRequestValue, error: any}} validate
*/
/**
 * @type {InitiateMixerRequestDTOType}
 */
const initiateMixerSchema = Joi.object({
    receiver_address: Joi.string().trim().regex(/^0x[a-fA-F0-9]{40}$/).required(),
    txn_hash: Joi.string().trim().regex(/^0x[a-fA-F0-9]{64}$/).required()
})

module.exports.initiateMixerRequestDTO = initiateMixerSchema;
