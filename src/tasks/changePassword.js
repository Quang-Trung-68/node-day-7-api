const mailService = require("@/services/mail.service");

async function changePassword(payload) {
  await mailService.changePassword(payload);
}

module.exports = changePassword;
