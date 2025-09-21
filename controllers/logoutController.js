// controllers/logoutController.js

const db = require('../config/dbconnection.js');
const { validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');

    module.exports = {

    logout: async (req, res) => {
    
        try {
                req.session.destroy((err) => {
                
                    if (err) {
                                console.error("Session destruction error:", err);
                                req.flash("error_msg", "Session destruction error");
                                return res.redirect("/");
                        }

                    res.clearCookie(process.env.SESSION_KEY);

                    // Full page logout
                    return res.render("auth/logout", { layout: false });
                });

            } catch (error) {
                        console.error(error);
                        req.flash("error_msg", "Internal server error");
                        return res.redirect("/");
                }
            }
        };

