const {
  createOrUpdateMixerRequestSchema,
} = require("../DTOs/requestDTOs/createOrUpdateMixerRequestDTO");
const {
  initiateMixerRequestDTO,
} = require("../DTOs/requestDTOs/initiateMixer");
const {
  createOrUpdateMixerResponseDTO,
} = require("../DTOs/responseDTOs/createOrUpdateMixerResponseDTO");
const { WalletAllocationService } = require("../services/wallet_allocation");
const { getDelayValueById } = require("../utils/constants/delays");
const { getInfoFromTxnHash } = require("../utils/web3/functions");
const EmailService = require("../services/email_service");
const { notifyMixerRequestDTO } = require("../DTOs/requestDTOs/notifyMixer");

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.createOrUdateMixerRequest = async (req, res, next) => {
  try {
    const { value, error } = createOrUpdateMixerRequestSchema.validate(
      req.body
    );
    if (error) return res.apiError(error?.details[0]?.message, 400);
    console.log(value);
    const walletService = new WalletAllocationService();
    const registeredMixerRequest = await walletService.createOrUpdate({
      receiver_address: value.receiver_address,
      delay: value.delay,
    });

    const responseObject = new createOrUpdateMixerResponseDTO(
      registeredMixerRequest
    );

    res.apiSuccess(responseObject);
  } catch (err) {
    console.error(err);
    res.apiError(err);
  }
};

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.initiateMixer = async (req, res, next) => {
  try {
    console.log("request received");
    const { value, error } = initiateMixerRequestDTO.validate(req.body);
    if (error) {
      console.log("Validation error:", error); // Log the validation error
      return res.apiError(error?.details[0]?.message, 400);
    }

    // Check if hash already utilized before
    const service = new WalletAllocationService();

    const { receiver_address, txn_hash } = value;
    console.log("Before checking for transaction hash");
    if (await service.isTxnExists(txn_hash))
      return res.apiError(
        "This transaction hash has already been utilized for another receiver before",
        400
      );
    console.log("After checking for transaction hash");
    const txn_object = await getInfoFromTxnHash(txn_hash);
    if (!txn_object) {
      console.log("Invalid transaction hash"); // Log the invalid transaction hash
      return res.apiError("invalid transaction hash", 400);
    }

    console.log("Transaction object retrieved:", txn_object); // Log the retrieved transaction object

    const receiverRequestInDb = await service.getMixerRequestByCombination({
      receiver_address,
      txn_at: txn_object.txn_at,
    });
    if (!receiverRequestInDb) {
      console.log("Transaction older than mixer request"); // Log the case when the transaction is older than the mixer request
      return res.apiError(
        "TXN provided is older than mixer request. Kindly deposit to address and then provide latest txn hash.",
        400
      );
    }
    if (receiverRequestInDb.deposit_wallet !== txn_object.receiver_address) {
      console.log(
        `ETH not deposited to the correct address. Expected: ${receiverRequestInDb.deposit_wallet}, Actual: ${txn_object.receiver_address}`
      ); // Log the case when ETH is not deposited to the correct address
      return res.apiError(
        `The ETH is not deposited to ${receiverRequestInDb.deposit_wallet} in this transaction`,
        400
      );
    }

    // Transaction Verified
    console.log(
      "Transaction verified. Deleting mixer request and sending notification."
    ); // Log the successful verification
    await service.deleteMixerRequest(receiver_address);
    await service.registerTxnHash(txn_hash);
    new EmailService()
      .sendMixerNotification({
        receiver_address,
        deposit_address: receiverRequestInDb.deposit_wallet,
        delay: getDelayValueById(receiverRequestInDb.delay),
        eth_value: txn_object.value,
        txn_hash,
      })
      .then()
      .catch();

    console.log("Request processed successfully"); // Log the successful processing
    return res.apiSuccess({
      message: "success",
    });
  } catch (err) {
    console.log("Error occurred:", err); // Log any errors that occur
    res.apiError(err);
  }
};

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('../utils/types/express').StandardResponse} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.notifyMixer = async (req, res, next) => {
  try {
    const { value, error } = notifyMixerRequestDTO.validate(req.body);
    if (error) return res.apiError(error?.details[0]?.message, 400);
    const service = new WalletAllocationService();
    const receiverRequestInDb = await service.getMixerRequestByCombination({
      receiver_address: value.receiver_address,
    });
    if (!receiverRequestInDb)
      return res.apiError(
        "Mixer request was not initiated. Try again creating a mixer request,",
        400
      );

    try {
      await service.deleteMixerRequest(value.receiver_address);
    } catch (err) {}

    new EmailService()
      .sendMixerNotification({
        receiver_address: value.receiver_address,
        deposit_address: receiverRequestInDb.deposit_wallet,
        delay: getDelayValueById(receiverRequestInDb.delay),
      })
      .then()
      .catch();

    res.apiSuccess({ message: "Will be notified shortly" });
  } catch (err) {
    res.apiError(err);
  }
};
