
// middlewares/auth.js
        module.exports = {
                
                isBoss: (req, res, next) => {
                                
                                if (req.session.isBoss) return next();

                                if (req.xhr) {
                                          return res.status(401).json({ redirectUrl: "/" });
                                }

                                req.flash('error_msg', 'Access denied. Please login first.');
                                return res.redirect("/");
                        },

                isMarketer: (req, res, next) => {

                                if (req.session.isMarketer) return next();

                                if (req.xhr) {
                                        return res.status(401).json({ redirectUrl: "/" });
                                }

                                req.flash('error_msg', 'Access denied. Please login first.');
                                return res.redirect("/");
                         }
        };
