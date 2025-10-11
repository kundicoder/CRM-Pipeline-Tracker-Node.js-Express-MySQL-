const db = require('../config/dbconnection.js');
const { renderWithLayout } = require('../helpers/renderWithLayout.js');
const { renderWithLayoutAndPartial } = require('../helpers/renderWithLayoutAndPartial.js');
const { validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');

module.exports = {

    home: async (req, res) => {
                
          try {
                 renderWithLayoutAndPartial(req, res, 'layouts/bossLayout', 'partials/boss/home', {}, 'bossContents');

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        },
        
    homeIndex: async (req, res) => {
                
          try {
                 renderWithLayout(req, res, 'layouts/bossLayout', 'partials/boss/home', {}, 'bossContents');

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
                 const [clients] = await db.query('SELECT * FROM clients ORDER BY id DESC');
                 renderWithLayout(req, res, 'layouts/bossLayout', 'partials/boss/clients', {clients: clients}, 'bossContents');

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        },

     services: async (req, res) => {
                
          try {
                 const auth = req.session.user;
                 const [services] = await db.query('SELECT * FROM services ORDER BY id DESC');
                 renderWithLayout(req, res, 'layouts/bossLayout', 'partials/boss/services', {services: services}, 'bossContents');

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        },

     team: async (req, res) => {
                
          try {
                 const auth = req.session.user;
                 const [team] = await db.query('SELECT * FROM users WHERE role = ? ORDER BY firstname ASC', ['marketer']);

                 renderWithLayout(req, res, 'layouts/bossLayout', 'partials/boss/team', {users: team}, 'bossContents');

            } catch (error) {
                        console.log(error);
                        if (req.xhr) return res.status(500).json({ error: 'Internal server error' });
                                        req.flash('error_msg', 'Internal server error');
                                        return res.redirect('back');
                }
        }
}