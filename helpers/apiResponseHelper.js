// helpers/apiResponseHelper.js
const { validationResult } = require("express-validator");

module.exports = {
    
  success(req, res, message, redirectUrl = "back") {

    if (req.xhr) {
      return res.json({ success: true, message });
    }
    req.flash("success_msg", message);
    return res.redirect(redirectUrl);

  },

  error(req, res, errors, status = 400, redirectUrl = "back") {

    if (req.xhr) {
      return res.status(status).json({ success: false, errors });
    }
    req.flash("error_msg", Array.isArray(errors) ? errors.join("<br>") : errors);
    return res.redirect(redirectUrl);

  },

  validate(req, res) {

    const formInputFieldsErrors = validationResult(req);

    if (!formInputFieldsErrors.isEmpty()) {
      const messages = formInputFieldsErrors.array().map(err => err.msg);
      this.error(req, res, messages);
      return false; // signal that validation failed
    }

    return true; // validation passed

  }
};
