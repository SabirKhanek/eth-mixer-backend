const { createOrUpdateMixerRequestSchema } = require('../DTOs/requestDTOs/createOrUpdateMixerRequestDTO')
const { initiateMixerRequestDTO } = require('../DTOs/requestDTOs/initiateMixer')
const { createOrUpdateMixerResponseDTO } = require('../DTOs/responseDTOs/createOrUpdateMixerResponseDTO')
const { WalletAllocationService } = require('../services/wallet_allocation')
const { getDelayValueById } = require('../utils/constants/delays')
const { sendMixerNotification } = require('../utils/functions/sendMixerNotification')
const { getInfoFromTxnHash } = require('../utils/web3/functions')
const delay = 

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.createOrUdateMixerRequest = async (req, res, next) => {
    try {
        const {value, error} = createOrUpdateMixerRequestSchema.validate(req.body)
        if(error) return res.apiError(error?.details[0]?.message, 400)
        console.log(value)
        const walletService = new WalletAllocationService()
        const registeredMixerRequest = await walletService.createOrUpdate({receiver_address: value.receiver_address, delay: value.delay})


        const responseObject = new createOrUpdateMixerResponseDTO(registeredMixerRequest)
        console.log('hi')
        res.apiSuccess(responseObject)
    } catch(err) {
        console.error(err)
        res.apiError(err)
    }
}

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.initiateMixer = async (req, res, next) =>{
    try {
        console.log("Request received"); // Add a log here to indicate the request is received
        
        const {value, error} = initiateMixerRequestDTO.validate(req.body)
        if(error) {
            console.log("Validation error:", error); // Log the validation error
            return res.apiError(error?.details[0]?.message, 400)
        }

        const {receiver_address, txn_hash} = value
        const txn_object = await getInfoFromTxnHash(txn_hash)
        if(!txn_object) {
            console.log("Invalid transaction hash"); // Log the invalid transaction hash
            return res.apiError('invalid transaction hash', 400)
        }

        console.log("Transaction object retrieved:", txn_object); // Log the retrieved transaction object
        
        const receiverRequestInDb = await (new WalletAllocationService()).getMixerRequestByCombination({receiver_address, txn_at: txn_object.txn_at})
        if(!receiverRequestInDb) {
            console.log("Transaction older than mixer request"); // Log the case when the transaction is older than the mixer request
            return res.apiError('TXN provided is older than mixer request. Kindly deposit to address and then provide latest txn hash.', 400)
        }
        if(receiverRequestInDb.deposit_wallet !== txn_object.receiver_address) {
            console.log(`ETH not deposited to the correct address. Expected: ${receiverRequestInDb.deposit_wallet}, Actual: ${txn_object.receiver_address}`); // Log the case when ETH is not deposited to the correct address
            return res.apiError(`The ETH is not deposited to ${receiverRequestInDb.deposit_wallet} in this transaction`, 400)
        }

        // Transaction Verified
        console.log("Transaction verified. Deleting mixer request and sending notification."); // Log the successful verification
        await (new WalletAllocationService()).deleteMixerRequest(receiver_address)
        await sendMixerNotification({
            receiver_address,
            deposit_address: receiverRequestInDb.deposit_wallet, 
            delay: getDelayValueById(receiverRequestInDb.delay),
            eth_value: txn_object.value,
            txn_hash
        })

        console.log("Request processed successfully"); // Log the successful processing
        return res.apiSuccess({
            message: 'success'
        })
    } catch(err) {
        console.log("Error occurred:", err); // Log any errors that occur
        res.apiError(err)
    }
}
