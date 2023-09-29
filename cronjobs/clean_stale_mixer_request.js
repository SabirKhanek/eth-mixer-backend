const cron = require('node-cron')
const CONFIG = require('../config');
const { WalletAllocationService } = require('../services/wallet_allocation');
const { minutesToCronExpression } = require('./minutesToCronExpression');

function setCleanStaleMixerRequestJob() {
    const cleanerFunction = (new WalletAllocationService()).deleteStaleMixerRequests
    cron.schedule(minutesToCronExpression(CONFIG.CLEANING_CRON_INTERVAL), cleanerFunction)
}

module.exports = setCleanStaleMixerRequestJob