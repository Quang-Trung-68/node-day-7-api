const ejs = require("ejs");
const path = require("node:path");

const mailConfig = require("@/configs/mail.config");
const { transporter } = require("@/libs/nodemailer");
const authService = require("@/services/auth.service");
const authConfig = require("../configs/auth.config");

class MailService {
  getTemplatePath(template) {
    const templatePath = path.join(
      __dirname,
      "..",
      "resource",
      "mail",
      `${template.replace(".ejs", "")}.ejs`,
    );
    return templatePath;
  }

  async send(options) {
    const { template, templateData, ...restOptions } = options;
    const templatePath = this.getTemplatePath(template);
    const html = await ejs.renderFile(templatePath, templateData);
    const result = await transporter.sendMail({ ...restOptions, html });

    return result;
  }

  async sendVerificationEmail(user) {
    const { fromAddress, fromName } = mailConfig;
    const verificationLink = authService.generateVerificationLink(user);
    const verificationEmailTTL = authConfig.verificationEmailTokenTTL / 3600;

    const result = await this.send({
      from: `"${fromName}" <${fromAddress}>`,
      to: user.email,
      subject: "Verification",
      template: "auth/verificationEmail",
      templateData: {
        verificationLink,
        verificationEmailTTL,
      },
    });

    return result;
  }
}

module.exports = new MailService();
