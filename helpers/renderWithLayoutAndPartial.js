
        exports.renderWithLayoutAndPartial = function(req, res, layoutName, partialView, data = {}, contentDivId) {
        
            try {
                
                if (req.xhr) {
                        // AJAX: render full layout and return JSON
                        return res.render(layoutName, { ...data, contentDivId, partialView }, (err, html) => {
                                        
                                if (err) throw err;

                                return res.json({
                                                    html, // full layout + partial
                                                    url: req.originalUrl
                                                });
                                });

                         } else {

                        // Normal page load: render layout + partial
                        return res.render(layoutName, { ...data, contentDivId, partialView });
                     }

             } catch (error) {

                console.error("renderWithLayoutAndPartial error:", error);

                if (req.xhr) return res.status(500).json({ error: "Internal server error" });

                    req.flash("error_msg", "Internal server error");
                    return res.redirect("back");
        }
    };