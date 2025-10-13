const db = require('../config/dbconnection.js');
const apiResponse = require("../helpers/apiResponseHelper");
const bcryptjs = require('bcryptjs');
const { capitalizeFirst, capitalizeWords, normalizeEmail, normalizePhone} = require("../helpers/formatters");

module.exports = {

    addStaff: async (req, res) => {
        
          try {
                const { firstname, surname, phone, email } = req.body;
                const auth = req.session.user;
                const created_at = new Date();
                const hashedPassword = await bcryptjs.hash('qwerty72', 10);

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;
                
                const [staffExist] = await db.query('SELECT id FROM users WHERE email = ? OR phone = ? LIMIT 1', [email, phone]);

                if (staffExist.length > 0) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This user already exists."]});
                            }

                        req.flash("error_msg", "This user already exists.");
                        return res.redirect('back');
                        
                } else {
                        const [result] = await db.query('INSERT INTO users(firstname, surname, phone, email, password, created_at, created_by) VALUES(?, ?, ?, ?, ?, ?, ?)', [capitalizeFirst(firstname), capitalizeFirst(surname), normalizePhone(phone), normalizeEmail(email), hashedPassword, created_at, auth.surname]);
                        const [team] = await db.query('SELECT * FROM users WHERE role = ? ORDER BY firstname ASC', ['marketer']);
                        
                        if (result.affectedRows > 0 && users.length > 0) {

                                if (req.xhr) {
                                    return res.json({ success: true, message: "Staff added successfully.", users: team});
                                }

                                req.flash("success_msg", "Staff added successfully.");
                                return res.redirect('back');
                        }

                        return apiResponse.error(req, res, ["Failed to add staff."]);
                }

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        },

    getStaff: async (req, res) => {
                
          try {
                 const {id} = req.params;
                 const [result] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
                 
                 if (!result.length) return res.status(404).json({ success: false, error: ['Not found'] });
                 return res.json({ success: true, staff: result[0] });

            } catch (error) {
                       console.log(error);
                       return res.status(500).json({ success:false, error: ['Internal server error'] });
                }
        },

    updateStaff: async (req, res) => {
        
          try {
                const {id} = req.params;
                const { firstname, surname, email, phone } = req.body;
                const auth = req.session.user;
                const updated_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;

                const [staffExist] = await db.query('SELECT id FROM users WHERE email = ? OR phone = ? LIMIT 1', [email, phone]);

                if (staffExist.length > 1) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This user already exists."]});
                            }

                        req.flash("error_msg", "This user already exists.");
                        return res.redirect('back');
                        
                }

                const [result] = await db.query('UPDATE users SET firstname = ?, surname = ?, email = ?, phone = ?, updated_at = ? WHERE id = ?', [ capitalizeFirst(firstname), capitalizeFirst(surname), normalizeEmail(email), normalizePhone(phone), updated_at, id ]);
                const [team] = await db.query('SELECT * FROM users WHERE role = ? ORDER BY firstname ASC', ['marketer']);
                     
                if (result.affectedRows > 0 && team.length > 0) {

                    if (req.xhr) {
                            return res.json({ success: true, message: "Staff updated successfully.", users: team});
                        }

                        req.flash("success_msg", "Staff updated successfully.");
                        return res.redirect('back');
                }

                return apiResponse.error(req, res, ["Failed to updated staff."]);
                

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        },

   blockStaff: async (req, res) => {
        
          try {
                const {id} = req.params;
                const auth = req.session.user;
                const updated_at = new Date();

                const [result] = await db.query('UPDATE users SET active = ?, updated_at = ? WHERE id = ?', [ 'no', updated_at, id ]);
                const [team] = await db.query('SELECT * FROM users WHERE role = ? ORDER BY firstname ASC', ['marketer']);
                        
                if (result.affectedRows > 0 && team.length > 0) {

                    if (req.xhr) {
                            return res.json({ success: true, message: "Staff blocked successfully.", users: team});
                        }

                        req.flash("success_msg", "Staff blocked successfully.");
                        return res.redirect('back');
                }

                return apiResponse.error(req, res, ["Failed to block staff."]);
                

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        },

    getMarketer: async (req, res) => {
                
          try {
                 const [result] = await db.query('SELECT * FROM users WHERE role = ? AND active = ?', ['marketer', 'yes']);
                 
                 if (!result.length) return res.status(404).json({ success: false, error: ['Not found'] });
                 return res.json({ success: true, marketers: result });

            } catch (error) {
                       console.log(error);
                       return res.status(500).json({ success:false, error: ['Internal server error'] });
                }
        }
}
