const mailService = require("@/services/mail.service");

async function sendVerificationEmail(payload) {
  const result = await mailService.sendVerificationEmail(payload);
  console.log(result);
}

module.exports = sendVerificationEmail;
