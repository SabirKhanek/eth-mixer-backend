const {Delay, DepositWallet, ReceiverWallet, ProcessedTxns, sequelize} = require('../database')
const CONFIG = require('../config')
const {Op} = require('sequelize')

class WalletAllocationService {
    /**
     * @param {string} receiver_address 
     * @returns 
     */
    async getReceiverWalletFromDb(receiver_address) {
        if(!receiver_address && typeof receiver_address !== 'string') return null
        const query = sequelize.where(sequelize.fn('LOWER', sequelize.col('wallet_address')), 'LIKE', `%${receiver_address.toLowerCase()}%`);
        const receiver_wallet_request = await ReceiverWallet.findAll({where: query, include: {model:Delay, as: 'delay_obj'}})
        if(receiver_wallet_request.length===0) return null
        return receiver_wallet_request[0]
    }

    async isTxnExists(txn_hash) {
        try {
            return (await ProcessedTxns.findOne({where: {txn_hash}}))?.dataValues.txn_hash
        } catch(err) {
            return null
        }
    }

    async registerTxnHash(txn_hash) {
        try {
            return await ProcessedTxns.create({txn_hash})
        } catch(err) {
            console.log('Error registering txn_hash')
        }
    }

    async deleteStaleMixerRequests() {
        try {
            const XMinutesAgo = new Date();
            XMinutesAgo.setMinutes(XMinutesAgo.getMinutes() - CONFIG.MIXER_REQUEST_STALE_THRESHOLD);   
            const affectedRows = await ReceiverWallet.destroy({
                where: {
                    updatedAt: {
                        [Op.lt]: XMinutesAgo
                    }
                }
            });

            if(affectedRows>0)console.log(`Deleted ${affectedRows} stale mixer requests.`);
        } catch (error) {
            console.error('Error deleting records:', error);
        }
    }

    async deleteMixerRequest(receiver_address) {
        try {
            const affectedRows = await ReceiverWallet.destroy({
                where: {
                    wallet_address: receiver_address
                }
            })
            return affectedRows>=1?true:false
        } catch(err) {
            console.error('Error deleting mixer info')
        }
    }

    async getDepositAddress() {
        const result = await DepositWallet.findAll({
            include: {
                model: ReceiverWallet,
                required: false
            }
        })
        const depositAddressMap = result.map((res)=>{
            const {wallet_address, receiver_wallets} = res.dataValues 
            return {
                wallet_address,
                receiver_wallets_length: receiver_wallets?.length
            }
        })

        depositAddressMap.sort((a,b)=>a.receiver_wallets_length-b.receiver_wallets_length)
        return depositAddressMap[0].wallet_address
    }

    /**
     * @param {{receiver_address:string,delay:string}} mixerDetail 
     */
    async createOrUpdate({receiver_address, delay='-1'}) {
        const receiverObj = await this.getReceiverWalletFromDb(receiver_address)
        const mode = receiverObj?'update':'create'
        if(mode==='update') {
            receiverObj.set('delay', delay)
            return await receiverObj.save()
        } else if(mode==='create') {
            return await ReceiverWallet.create({
                wallet_address: receiver_address,
                deposit_wallet: await this.getDepositAddress(),
                delay: delay||'-1'
            })
        }
    }

    /**
     * @param {{receiver_address:string, txn_at: Date}} mixerDetail
     */
    async getMixerRequestByCombination({receiver_address,txn_at }) {
        try{
            const result = await ReceiverWallet.findAll({
                where: {
                    wallet_address: receiver_address, 
                    createdAt: {
                        [Op.lt]: txn_at
                    }
                }, include: {
                    model:Delay, 
                    as: 'delay_obj'
                }
            })
            if(result.length===0) return null
            return result[0]
        } catch(err) {
            console.log(err)
            return null
        }
    }
}

// setTimeout(async ()=>{
//     const service = new WalletAllocationService()
//     console.log(await service.getReceiverWalletFromDb('0xFE31320faF8Da1492Eadf8Deb79bd264D7cF2141'))
// }, 5_000)

// setTimeout(async ()=>{
//     const service = new WalletAllocationService()
//     console.log(await service.getDepositAddress())
// }, 5_000)

// setTimeout(async ()=>{
//     const service = new WalletAllocationService()
//     console.log(await service.createOrUpdate({receiver_address: '0xABC1320faF8Da1492Eadf8Deb79bd264D7cF2DEF', delay:'2'}))
// }, 5_000)

module.exports.WalletAllocationService = WalletAllocationService