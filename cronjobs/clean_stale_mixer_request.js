const cron = require('node-cron')
const CONFIG = require('../config');
const { WalletAllocationService } = require('../services/wallet_allocation');
const { minutesToCronExpression } = require('./minutesToCronExpression');

function setCleanStaleMixerRequestJob() {
      console.log('Clean stale mixer requests cron job being set')
    const cleanerFunction = (new WalletAllocationService()).deleteStaleMixerRequests
    cron.schedule(minutesToCronExpression(CONFIG.CLEANING_CRON_INTERVAL), cleanerFunction)
}

module.exports = setCleanStaleMixerRequestJob