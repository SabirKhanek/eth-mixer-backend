const Joi = require('joi')

const createOrUpdateMixerRequestSchema = Joi.object({
    receiver_address: Joi.string().trim().lowercase().regex(/^0x[a-fA-F0-9]{40}$/).required(),
    delay: Joi.string().trim().lowercase().default('-1')
})

module.exports.createOrUpdateMixerRequestSchema = createOrUpdateMixerRequestSchema