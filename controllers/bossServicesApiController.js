const db = require('../config/dbconnection.js');
const apiResponse = require("../helpers/apiResponseHelper");
const bcryptjs = require('bcryptjs');
const { capitalizeFirst, capitalizeWords, normalizeEmail, normalizePhone} = require("../helpers/formatters");

module.exports = {

    addService: async (req, res) => {
        
          try {
                const { service } = req.body;
                const auth = req.session.user;
                const created_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;
                
                const [serviceExist] = await db.query('SELECT id FROM services WHERE name = ? LIMIT 1', [service]);

                if (serviceExist.length > 0) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This service already exists."]});
                            }

                        req.flash("error_msg", "This service already exists.");
                        return res.redirect('back');
                        
                } else {
                        const [result] = await db.query('INSERT INTO services(name, created_at, created_by) VALUES(?, ?, ?)', [capitalizeWords(service), created_at, auth.surname]);
                        const [services] = await db.query('SELECT * FROM services ORDER BY name ASC');
                        
                        if (result.affectedRows > 0 && services.length > 0) {

                                if (req.xhr) {
                                    return res.json({ success: true, message: "Service added successfully.", services: services});
                                }

                                req.flash("success_msg", "Service added successfully.");
                                return res.redirect('back');
                        }

                        return apiResponse.error(req, res, ["Failed to add service."]);
                }

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        },

    getService: async (req, res) => {
                
          try {
                 const {id} = req.params;
                 const [result] = await db.query('SELECT * FROM services WHERE id = ? LIMIT 1', [id]);
                 
                 if (!result.length) return res.status(404).json({ success: false, error: ['Not found'] });
                 return res.json({ success: true, service: result[0] });

            } catch (error) {
                       console.log(error);
                       return res.status(500).json({ success:false, error: ['Internal server error'] });
                }
        },

    updateService: async (req, res) => {
        
          try {
                const {id} = req.params;
                const { service } = req.body;
                const auth = req.session.user;
                const updated_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;

                const [result] = await db.query('UPDATE services SET name = ?, updated_at = ? WHERE id = ?', [capitalizeWords(service), updated_at, id]);
                const [services] = await db.query('SELECT * FROM services ORDER BY name ASC');
                        
                if (result.affectedRows > 0 && services.length > 0) {

                    if (req.xhr) {
                            return res.json({ success: true, message: "Service updated successfully.", services: services});
                        }

                        req.flash("success_msg", "Service updated successfully.");
                        return res.redirect('back');
                }

                return apiResponse.error(req, res, ["Failed to updated service."]);
                

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        }
}