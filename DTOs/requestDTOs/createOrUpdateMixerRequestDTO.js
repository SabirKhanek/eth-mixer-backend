const Joi = require('joi')

const createOrUpdateMixerRequestSchema = Joi.object({
    receiver_address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required(),
    delay: Joi.string().default('-1')
})

module.exports.createOrUpdateMixerRequestSchema = createOrUpdateMixerRequestSchema