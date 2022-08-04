const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  process.env.SENDGRID_API
);

const sendEmail = ({ email, first_name, bank_name, card_name }) => {
  const msg = {
    to: email, 
    from: "will.smith1505@gmail.com", 
    subject: "Use It Or Lose It",
    text: `text`,
    html: `<strong>Hi, ${first_name}! This is a reminder to user your ${bank_name} ${card_name} credit card today.</strong>`,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { sendEmail };
