const CONFIG = require('../../config')
class createOrUpdateMixerResponseDTO {
    constructor(respObj) {
        const {wallet_address, deposit_wallet, delay, updatedAt, createdAt} = respObj
        this.wallet_address = wallet_address
        this.deposit_wallet = deposit_wallet
        this.delay = delay
        this.requestStaleIn = CONFIG.MIXER_REQUEST_STALE_THRESHOLD
        this.updatedAt = updatedAt
        this.createdAt = createdAt
    }
}

module.exports.createOrUpdateMixerResponseDTO = createOrUpdateMixerResponseDTO