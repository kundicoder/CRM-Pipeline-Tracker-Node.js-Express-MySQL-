const db = require('../config/dbconnection.js');
const { renderWithLayout } = require('../helpers/renderWithLayout.js');
const { renderWithLayoutAndPartial } = require('../helpers/renderWithLayoutAndPartial.js');
const { validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');

module.exports = {

    home: async (req, res) => {
        
          try {
                renderWithLayoutAndPartial(req, res, 'layouts/marketerLayout', 'partials/marketer/home', {}, 'marketerContents'); //without data

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        },

    homeIndex: async (req, res) => {
                
          try {
                 renderWithLayout(req, res, 'layouts/marketerLayout', 'partials/marketer/home', {}, 'marketerContents'); //without data

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        },

    pipelines: async (req, res) => {
                
          try {
                 renderWithLayout(req, res, 'layouts/marketerLayout', 'partials/marketer/pipelines', {}, 'marketerContents'); //without data

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        },

    clients: async (req, res) => {
                
          try {
                 const auth = req.session.user;
                 const [clients] = await db.query('SELECT * FROM clients WHERE created_by = ?', [auth.id]);
                 renderWithLayout(req, res, 'layouts/marketerLayout', 'partials/marketer/clients', {clients: clients}, 'marketerContents'); //without data

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        },

    reports: async (req, res) => {
                
          try {
                 renderWithLayout(req, res, 'layouts/marketerLayout', 'partials/marketer/reports', {}, 'marketerContents'); //without data

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        }
}