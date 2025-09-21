        // helpers/renderWithLayout.js
        /**
            * Renders a partial view or full layout depending on request type.
            * @param {Object} req - Express request object
            * @param {Object} res - Express response object
            * @param {String} layoutName - Layout file to render (for normal requests)
            * @param {String} partialView - Partial view file to render
            * @param {Object} [data={}] - Optional data to pass to the template
            * @param {String} contentDivId - Required div ID for layout to inject partial
        */
        // AJAX → return JSON: { html, target } html already contains the final output (ready to inject into the DOM).
        
        exports.renderWithLayout = function(req, res, layoutName, partialView, data = {}, contentDivId) {
        
        if (!contentDivId) {
                throw new Error("contentDivId is required for both layout rendering");
                }

        try {
                if (req.xhr) {

                        // AJAX → render the partial to string, then send JSON { html, target, url }
                        res.render(partialView, data, (err, html) => {

                                if (err) {
                                            console.error('render partial error', err);
                                            return res.status(500).json({ error: 'Failed to render partial' });
                                        }
                                            return res.json({
                                                  html, // rendered partial HTML,
                                                  target: contentDivId, // target (may be null if caller didn't pass one)
                                                  url: req.originalUrl // url to push into history
                                              });
                                });

                         } else {
                                // Full page load: render the layout which includes the partial server-side
                               return res.render(layoutName, { ...data, contentDivId, partialView });
                        }
                   } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                  }
                };