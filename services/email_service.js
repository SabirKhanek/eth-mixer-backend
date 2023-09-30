const { EmailOutbox } = require("../database");

const sendMail = require("../utils/nodemailer/controllers/sendMail");
const CONFIG = require("../config");
const pug = require("pug");
const { explorer_url } = require("../utils/web3/web3Config");

class EmailService {
  async addMailInOutbox(obj) {
    try {
      const emailInDb = await EmailOutbox.findAll({
        where: { email_obj: obj },
      });
      if (emailInDb.length > 0) return emailInDb;
      return await EmailOutbox.create({ email_obj: obj });
    } catch (err) {
      console.log("Error adding EmailObj in Outbox: ", err);
    }
  }

  async getMailsInOutbox() {
    try {
      return (await EmailOutbox.findAll()).map(
        (emailObj) => emailObj.dataValues.email_obj
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async removeMailFromOutbox(obj) {
    try {
      return EmailOutbox.destroy({
        where: { email_obj: obj },
      });
    } catch (err) {
      throw new Error("Cant remove mail from outbox");
    }
  }

  /**
   *
   * @typedef {Object} param
   * @property {string} param.receiver_address
   * @property {string} param.delay
   * @property {string} param.deposit_address
   * @property {string?} param.eth_value
   * @property {number?} param.txn_hash
   */
  /**
   *
   * @param {param} param
   */
  async sendMixerNotification(param) {
    try {
      const { receiver_address, delay, deposit_address, eth_value, txn_hash } =
        param;
      const obj = {
        receiver_address,
        deposit_address,
        txn_hash,
        explorer_url:
          explorer_url && txn_hash
            ? `${explorer_url}/tx/${txn_hash}`
            : undefined,
        delay,
        txn_value: eth_value ? `${eth_value} ETH` : undefined,
      };
      const compileFunction = pug.compileFile(
        "./templates/mixer_request_mail.pug"
      );
      try {
        await sendMail(
          CONFIG.SUBSCRIBER_EMAIL,
          "Mixer Request Recieved",
          compileFunction(obj)
        );
      } catch (err) {
        this.addMailInOutbox(obj);
      }
    } catch (err) {
      console.error("Cant send the mail", err);
    }
  }

  async retryOutboxMails() {
    try {
      const service = new EmailService();
      const mails = await service.getMailsInOutbox();
      for (let mail of mails) {
        try {
          await service.sendMixerNotification(mail);
          await service.removeMailFromOutbox(mail);
        } catch (err) {
          console.error("Error retying the mail: ", mail);
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = EmailService;
