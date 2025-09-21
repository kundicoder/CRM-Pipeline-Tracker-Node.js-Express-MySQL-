
// middlewares/auth.js
        module.exports = {
                
                isUser: (req, res, next) => {
                                
                                if (req.session.isUser) return next();

                                if (req.xhr) {
                                          return res.status(401).json({ redirectUrl: "/" });
                                }

                                req.flash('error_msg', 'Access denied. Please login first.');
                                return res.redirect("/");
                        },

                isAdmin: (req, res, next) => {

                                if (req.session.isAdmin) return next();

                                if (req.xhr) {
                                        return res.status(401).json({ redirectUrl: "/" });
                                }

                                req.flash('error_msg', 'Access denied. Please login first.');
                                return res.redirect("/");
                         }
        };
