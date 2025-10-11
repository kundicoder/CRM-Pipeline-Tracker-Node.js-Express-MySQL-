// helpers/apiResponseHelper.js
const { validationResult } = require("express-validator");

module.exports = {
      
  /**
   * Success response helper
   * @param {Request} req
   * @param {Response} res
   * @param {String} message - Success message
   * @param {Object|null} data - Optional payload
   * @param {String} redirectUrl - Redirect fallback for non-AJAX
   */

  success(req, res, data = null, message, redirectUrl = "back") { //What if I return response with data? I think we should add new parameter like 'data', sometimes I pass data sometimes I don't

    if (req.xhr) {

      const response = { success: true, message };

      if (data) response.data = data; // ✅ Only include if provided
      return res.json(response);
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
