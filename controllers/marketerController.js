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
                 const auth = req.session.user;
                 const [pipelines] = await db.query('SELECT clients.id AS clientId, clients.firstname, clients.surname, clients.company, clients.position, clients.phone, clients.assigned_to, pipelines.id AS pipelineId, pipelines.agenda, pipelines.status, pipelines.created_at, pipelines.created_by FROM clients JOIN pipelines ON clients.id = pipelines.client_id WHERE pipelines.created_by = ? ORDER BY pipelines.id DESC', [auth.id]);
                 renderWithLayout(req, res, 'layouts/marketerLayout', 'partials/marketer/pipelines', {pipelines: pipelines}, 'marketerContents'); //without data

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
                 const [clients] = await db.query('SELECT * FROM clients WHERE created_by = ? OR assigned_to = ?', [auth.id, auth.id]);
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