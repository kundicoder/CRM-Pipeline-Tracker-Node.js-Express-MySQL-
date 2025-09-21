const db = require('../config/dbconnection.js');
const { renderWithLayout } = require('../helpers/renderWithLayout.js');
const { renderWithLayoutAndPartial } = require('../helpers/renderWithLayoutAndPartial.js');
const { validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');

module.exports = {

    home: async (req, res) => {
                
          try {
                 renderWithLayoutAndPartial(req, res, 'layouts/adminLayout', 'partials/admin/home', {}, 'adminContents'); //without data

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        },
        
    homeIndex: async (req, res) => {
                
          try {
                 renderWithLayout(req, res, 'layouts/adminLayout', 'partials/admin/home', {}, 'adminContents'); //without data

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        }
}