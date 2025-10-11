const db = require('../config/dbconnection.js');
const apiResponse = require("../helpers/apiResponseHelper");
const bcryptjs = require('bcryptjs');
const { capitalizeFirst, capitalizeWords, normalizeEmail, normalizePhone} = require("../helpers/formatters");

module.exports = {

    addClient: async (req, res) => {
        
          try {
                const { firstname, surname, phone, email, company, position } = req.body;
                const auth = req.session.user;
                const created_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;
                
                const [clientExist] = await db.query('SELECT id FROM clients WHERE phone = ? OR email = ? LIMIT 1', [phone, email]);

                if (clientExist.length > 0) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This client was already registered."]});
                            }

                        req.flash("error_msg", "This client was already registered.");
                        return res.redirect('back');
                        
                } else {
                        const [result] = await db.query('INSERT INTO clients(firstname, surname, email, phone, company, position, created_at, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [capitalizeFirst(firstname), capitalizeFirst(surname), normalizeEmail(email), normalizePhone(phone), capitalizeFirst(company), capitalizeFirst(position), created_at, auth.id]);
                        const [clients] = await db.query('SELECT * FROM clients WHERE created_by = ?', [auth.id]);
                        
                        if (result.affectedRows > 0 && clients.length > 0) {

                                if (req.xhr) {
                                    return res.json({ success: true, message: "Client added successfully.", clients: clients});
                                }

                                req.flash("success_msg", "Client added successfully.");
                                return res.redirect('back');
                        }

                        return apiResponse.error(req, res, ["Failed to add client."]);
                }

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        },
        
        getClient: async (req, res) => {
                
          try {
                 const {id} = req.params;
                 const [result] = await db.query('SELECT * FROM clients WHERE id = ? LIMIT 1', [id]);
                 
                 if (!result.length) return res.status(404).json({ success: false, error: ['Not found'] });
                 res.json({ success: true, client: result[0] });

            } catch (error) {
                        console.log(error);
                         res.status(500).json({ success:false, error: ['Internal server error'] });
                }
        },

        updateClient: async (req, res) => {
        
          try {
                const {id} = req.params;
                const { firstname, surname, phone, email, company, position } = req.body;
                const auth = req.session.user;
                const updated_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;
                
                const [clientExist] = await db.query('SELECT id FROM clients WHERE phone = ? OR email = ? LIMIT 1', [phone, email]);

                if (clientExist.length > 1) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This client was already registered."]});
                            }

                        req.flash("error_msg", "This client was already registered.");
                        return res.redirect('back');
                        
                } else {
                        const [result] = await db.query('UPDATE clients SET firstname = ?, surname = ?, email = ?, phone = ?, company = ?, position = ?, updated_at = ? WHERE id = ?', [capitalizeFirst(firstname), capitalizeFirst(surname), normalizeEmail(email), normalizePhone(phone), capitalizeFirst(company), capitalizeFirst(position), updated_at, id]);
                        const [clients] = await db.query('SELECT * FROM clients WHERE created_by = ?', [auth.id]);
                        
                        if (result.affectedRows > 0 && clients.length > 0) {

                                if (req.xhr) {
                                    return res.json({ success: true, message: "Client updated successfully.", clients: clients});
                                }

                                req.flash("success_msg", "Client updated successfully.");
                                return res.redirect('back');
                        }

                        return apiResponse.error(req, res, ["Failed to updated client."]);
                }

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        }
}