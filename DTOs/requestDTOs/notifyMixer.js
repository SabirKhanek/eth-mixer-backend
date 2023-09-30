const Joi = require("joi");

/**
 * @typedef {Object} notifyMixerRequestValue
 * @property {string} receiver_address
 */

/**
 * @typedef {Object} notifyMixerRequestDTOType
 * @property {(value: any) => {value: notifyMixerRequestValue, error: any}} validate
 */
/**
 * @type {notifyMixerRequestDTOType}
 */
const notifyMixerSchema = Joi.object({
  receiver_address: Joi.string()
    .trim()
    .lowercase()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .required(),
});

module.exports.notifyMixerRequestDTO = notifyMixerSchema;
