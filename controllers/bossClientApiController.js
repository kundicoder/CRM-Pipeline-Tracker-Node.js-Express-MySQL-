const db = require('../config/dbconnection.js');
const apiResponse = require("../helpers/apiResponseHelper");
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { capitalizeFirst, capitalizeWords, normalizeEmail, normalizePhone} = require("../helpers/formatters");

module.exports = {

    assignStaff: async (req, res) => {
        
          try {
                const { firstname, surname, phone, email, company, position, staffId } = req.body;
                const auth = req.session.user;
                const created_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;
                
                const [staffExist] = await db.query('SELECT id FROM clients WHERE email = ? OR phone = ? LIMIT 1', [email, phone]);

                if (staffExist.length > 0) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This client exists."]});
                            }

                        req.flash("error_msg", "This client exists.");
                        return res.redirect('back');
                        
                } else {
                        const [result] = await db.query('INSERT INTO clients(firstname, surname, email, phone, company, position, assigned_to, created_at, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [capitalizeFirst(firstname), capitalizeFirst(surname), normalizeEmail(email), normalizePhone(phone), capitalizeFirst(company), capitalizeFirst(position), staffId, created_at, auth.id]);
                        const [clients] = await db.query('SELECT * FROM clients ORDER BY firstname ASC');
                        const [staff] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [staffId]);
                        
                        if (result.affectedRows > 0 && clients.length > 0  && staff.length > 0) {

                            // ✅ Configure Nodemailer transporter
                                const transporter = nodemailer.createTransport({
                                        host: "natkerntz.com",
                                        port: 465,
                                        secure: true,
                                        auth: {
                                                user: process.env.EMAIL_USER,
                                                pass: process.env.EMAIL_PASS,
                                            },
                                });

                            // ✅ Build mail options
                                const mailOptions = {
                                    from: process.env.EMAIL_USER,
                                    to: staff[0].email,
                                    subject: `New Client Assigned - ${capitalizeFirst(firstname)} ${capitalizeFirst(surname)}`,
                                    html: `
<p>Hello <strong>${capitalizeFirst(staff[0].firstname)}</strong>,</p>
<p>You have been assigned a new client:</p>
<ul>
    <li><b>Client:</b> ${capitalizeFirst(firstname)} ${capitalizeFirst(surname)}</li>
    <li><b>Email:</b> ${normalizeEmail(email)}</li>
    <li><b>Phone:</b> ${normalizePhone(phone)}</li>
    <li><b>Company:</b> ${capitalizeFirst(company)}</li>
    <li><b>Position:</b> ${capitalizeFirst(position)}</li>
</ul>
    <p>Please reach out to the client as soon as possible.</p>
    <p>Regards,<br>Natkern Management</p>
          `,
};
// ✅ Send email
                            try {
                                    const emailCheck = await transporter.sendMail(mailOptions);

                                    if ( emailCheck.accepted && emailCheck.accepted.length > 0 ) {
                                        
                                            if (req.xhr) {
                                                    return res.json({ success: true, message: "Client assigned successfully, and email sent.", clients: clients});
                                                 }

                                            req.flash("success_msg", "Client assigned successfully, and email sent.");
                                            return res.redirect('back');
                                    }else{

                                        if (req.xhr) {
                                                    return res.json({ success: false, error: ["Client assigned successfully, but email not sent."], clients: clients});
                                                 }

                                        req.flash("error_msg", "Client assigned, but email failed to send.");
                                        return res.redirect("back");
                                    }

                                } catch (emailErr) {
                                    console.error("❌ Failed to send email:", emailErr);
                                      return apiResponse.error(req, res, ["Internal Server Error"], 500);
                                }
                        }

                        return apiResponse.error(req, res, ["Failed to assign client."]);
                }

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        }
}
