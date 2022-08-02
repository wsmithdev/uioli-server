const cronJob = require("node-cron");
const Notify = require("./models/notify")

const { sendEmail } = require("./twilio/email")

const init = async () => {
  const cards = await Notify.getCards()
  
  for(const card of cards){
    const emailData = {
      email: card.email,
      first_name: card.first_name,
      bank_name: card.bank_name,
      card_name: card.card_name
    }

    console.log("sending email")
    sendEmail(emailData)
  }  
}















const cron = () => {
  cronJob.schedule("00 07 00 * * *", () => {
    init()
  });
};

module.exports = { cron };
