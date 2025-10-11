const db = require('../config/dbconnection.js');
const { validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');

module.exports = {

        index: async (req, res) => {
                try {
                        return res.render('auth/index');
                    } catch (error) {
                        console.log(error);
                    }
            },

        login: async (req, res) => {

                try {
                        const inputerrors = validationResult(req);
                        const { email, password } = req.body;

                    if (!inputerrors.isEmpty()) {

                        const messages = inputerrors.array().map(err => err.msg);
                        req.flash('error_msg', messages.join('<br>'));
                        return res.redirect('back');
                    }

                    // Find user
                    const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

                    if (rows.length === 0) {
                            
                        if (req.xhr) return res.json({ error: 'Incorrect e-mail address.' });
                                            req.flash('error_msg', 'Incorrect e-mail address.');
                                     return res.redirect('back');
                            }

                            const user = rows[0];
                            const passwordMatch = await bcryptjs.compare(password, user.password);

                        if (!passwordMatch) {

                            if (req.xhr) return res.json({ error: 'Invalid password' });
                                        req.flash('error_msg', 'Invalid password');
                                        return res.redirect('back');
                             }

                        // Successful auth: set session flags according to role
                        if (user.role === 'boss') {

                                req.session.isBoss = true;

                        } else if (user.role === 'marketer') {

                                req.session.isMarketer = true;
                        }

                        req.session.user = user;
                        // Save session then respond
                        return req.session.save((err) => {

                                    if (err) {
                                             console.error("Session save error:", err);

                                            if (req.xhr) return res.status(500).json({ error: 'Internal session error, try again.' });
                                                
                                                req.flash("error_msg", "Internal session error, try again.");
                                                return res.redirect("back");
                                        }

                                    // ✅ Key Change: AJAX only returns the URL, not rendered HTML
                                    if (req.xhr) {
                                                if (user.role === 'boss') {
                                                        return res.json({ success: true, redirectUrl: '/boss' });
                                                    }
                                                
                                                if (user.role === 'marketer') {
                                                        return res.json({ success: true, redirectUrl: '/marketer' });
                                                    }
                                        }

                                    // Non-AJAX: standard redirect
                                    if (user.role === 'boss') return res.redirect('/boss');

                                    if (user.role === 'marketer') return res.redirect('/marketer');
                                    
                                    return res.redirect('back'); // fallback

                                 });

                    } catch (error) {

                        console.log(error);
                        
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                        req.flash('error_msg', 'Internal server error');
                        return res.redirect('back');
                }
         }
};
