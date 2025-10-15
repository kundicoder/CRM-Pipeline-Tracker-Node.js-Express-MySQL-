const db = require('../config/dbconnection.js');
const apiResponse = require("../helpers/apiResponseHelper");
const bcryptjs = require('bcryptjs');
const { capitalizeFirst, capitalizeWords, normalizeEmail, normalizePhone} = require("../helpers/formatters");
const nodemailer = require('nodemailer');

module.exports = {

    addClient: async (req, res) => {
        
          try {
                const { firstname, surname, phone, email, company, position } = req.body;
                const auth = req.session.user;
                const created_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;
                
                const [clientExist] = await db.query('SELECT id FROM clients WHERE phone = ? OR email = ? LIMIT 1', [phone, email]);

                if (clientExist.length > 0) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This client was already registered."]});
                            }

                        req.flash("error_msg", "This client was already registered.");
                        return res.redirect('back');
                        
                } else {
                        const [result] = await db.query('INSERT INTO clients(firstname, surname, email, phone, company, position, created_at, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [capitalizeFirst(firstname), capitalizeFirst(surname), normalizeEmail(email), normalizePhone(phone), capitalizeFirst(company), capitalizeFirst(position), created_at, auth.id]);
                        const [clients] = await db.query('SELECT * FROM clients WHERE created_by = ? OR assigned_to = ?', [auth.id, auth.id]);
 
                        if (result.affectedRows > 0 && clients.length > 0) {

                                if (req.xhr) {
                                    return res.json({ success: true, message: "Client added successfully.", clients: clients});
                                }

                                req.flash("success_msg", "Client added successfully.");
                                return res.redirect('back');
                        }

                        return apiResponse.error(req, res, ["Failed to add client."]);
                }

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        },
        
        getClient: async (req, res) => {
                
          try {
                 const {id} = req.params;
                 const [result] = await db.query('SELECT * FROM clients WHERE id = ? LIMIT 1', [id]);
                 
                 if (!result.length) return res.status(404).json({ success: false, error: ['Not found'] });
                 res.json({ success: true, client: result[0] });

            } catch (error) {
                        console.log(error);
                         res.status(500).json({ success:false, error: ['Internal server error'] });
                }
        },

        updateClient: async (req, res) => {
        
          try {
                const {id} = req.params;
                const { firstname, surname, phone, email, company, position } = req.body;
                const auth = req.session.user;
                const updated_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;
                
                const [clientExist] = await db.query('SELECT id FROM clients WHERE phone = ? OR email = ? LIMIT 1', [phone, email]);

                if (clientExist.length > 1) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This client was already registered."]});
                            }

                        req.flash("error_msg", "This client was already registered.");
                        return res.redirect('back');
                        
                } else {
                        const [result] = await db.query('UPDATE clients SET firstname = ?, surname = ?, email = ?, phone = ?, company = ?, position = ?, updated_at = ? WHERE id = ?', [capitalizeFirst(firstname), capitalizeFirst(surname), normalizeEmail(email), normalizePhone(phone), capitalizeFirst(company), capitalizeFirst(position), updated_at, id]);
                        const [clients] = await db.query('SELECT * FROM clients WHERE created_by = ? OR assigned_to = ?', [auth.id, auth.id]);
                        
                        if (result.affectedRows > 0 && clients.length > 0) {

                                if (req.xhr) {
                                    return res.json({ success: true, message: "Client updated successfully.", clients: clients});
                                }

                                req.flash("success_msg", "Client updated successfully.");
                                return res.redirect('back');
                        }

                        return apiResponse.error(req, res, ["Failed to updated client."]);
                }

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        },

       checkClients: async (req, res) => {

                try {
                        const auth = req.session.user;

                        // Run queries in parallel
                        const [[clients], [services]] = await Promise.all([
                                        db.query('SELECT * FROM clients WHERE assigned_to = ? OR created_by = ? ORDER BY firstname ASC', [auth.id, auth.id]),
                                        db.query('SELECT * FROM services ORDER BY name ASC'),
                                ]);

                        // Handle empty data conditions
                        if (clients.length === 0) {
                                return res.json({ success: false, error: ['No client found. Register client first']});
                                }

                        if (services.length === 0) {
                                return res.json({ success: false, error: ['No service found.'] });
                                }

                        // ✅ Success response
                        return res.status(200).json({ success: true, clients, services });

                } catch (error) {
                                console.error('Problem is:', error);
                                return res.status(500).json({ success: false, error: ['Internal server error. Please try again later.'] });
                        }
                },

        addPipeline: async (req, res) => {
        
          try {
                const { clientId, serviceIDs, agenda } = req.body;
                const auth = req.session.user;
                const created_at = new Date();

                // ✅ Run validation
                if (!apiResponse.validate(req, res)) return;
                
                const [pipelineExist] = await db.query('SELECT id FROM pipelines WHERE client_id = ? AND status = ? AND created_by = ? LIMIT 1', [ clientId, 'negotiation', auth.id ]);

                if (pipelineExist.length > 0) {

                        if (req.xhr) { 
                                    return res.json({ success: false, error: ["This pipeline exists and not closed yet."]});
                            }

                        req.flash("error_msg", "This pipeline exists and not closed yet.");
                        return res.redirect('back');
                        
                } else {
                        const [pipeline] = await db.query('INSERT INTO pipelines( client_id, agenda, status, created_at, created_by ) VALUES( ?, ?, ?, ?, ? )', [clientId, capitalizeWords(agenda), 'negotiation', created_at, auth.id]);
                        
                        if (pipeline.affectedRows > 0) {

                                const pipelineId = pipeline.insertId; // Get newly inserted pipeline ID
                                
                                // ✅ Ensure serviceIDs is always an array
                                // const serviceArray = Array.isArray(serviceIDs) ? serviceIDs : [serviceIDs];
                                const serviceArray = [].concat(serviceIDs);

                                // ✅ Prepare bulk insert data for pivot table
                                const values = serviceArray.map((sid) => [pipelineId, sid]);
                                
                                // ✅ Insert all service links at once
                                const [pivotInsert] = await db.query('INSERT INTO pipelines_services (pipeline_id, service_id) VALUES ?', [values]);
                                const [allPipelines] = await db.query('SELECT clients.id AS clientId, clients.firstname, clients.surname, clients.company, clients.phone, clients.position, clients.assigned_to, pipelines.id AS pipelineId, pipelines.agenda, pipelines.status, pipelines.created_at, pipelines.created_by FROM pipelines JOIN clients ON clients.id = pipelines.client_id WHERE clients.assigned_to = ? OR pipelines.created_by = ? ORDER BY pipelines.id DESC', [auth.id, auth.id]);
                                const [bosses] =  await db.query('SELECT email FROM users WHERE role = ?', ['boss']);
                                const [client] = await db.query('SELECT * FROM clients WHERE id = ? LIMIT 1', [clientId]);
                                
                                const [services] = await db.query('SELECT name FROM services WHERE id IN (?)', [serviceIDs]);

                                        // Function to format services into a comma-separated string
                                        const formatServices = (services) => {
                                                return services.map(service => service.name).join(', ');
                                        };

                                const servicesString = formatServices(services);

                                if (pivotInsert.affectedRows > 0 && allPipelines.length > 0 && bosses.length > 0 && client.length > 0) {

                                // ✅ Configure Nodemailer transporter
                                const transporter = nodemailer.createTransport({
                                        host: "natkerntz.com",
                                        port: 465,
                                        secure: true,
                                        auth: {
                                                user: process.env.EMAIL_USER,
                                                pass: process.env.EMAIL_PASS,
                                            },
                                });

                                // ✅ Build mail options
                                const bossEmails = bosses.map(b => b.email).join(', ');

                                // ✅ Build mail options
                                const mailOptions = {
                                        from: process.env.EMAIL_USER,
                                        to: bossEmails,
                                        subject: `Marketing Appointment - ${capitalizeFirst(auth.firstname)} ${capitalizeFirst(auth.surname)}`,
                                        html: `
  <div style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.6; font-size: 15px;">
    <p>Greetings Management,</p>

    <p>I hope you are doing well.</p>

    <p>
      I wanted to inform you that today I have scheduled a meeting with a new client 
      <strong>${client[0].firstname} ${client[0].surname}</strong>, who is working at 
      <strong>${client[0].company}</strong> as <strong>${client[0].position}</strong>.
    </p>

    <p>The purpose of the meeting is to discuss the following:</p>

    <ul style="margin: 10px 0 10px 25px;">
      <li><strong>Agenda:</strong> ${agenda}</li>
      <li><strong>Services:</strong> ${servicesString}</li>
    </ul>

    <p>
      I will ensure to keep you updated with any important developments following the meeting.
      Please let me know if you have any specific points you would like me to address during this discussion.
    </p>

    <p style="margin-top: 20px;">
      Best regards,<br>
      <strong>${auth.firstname} ${auth.surname}</strong><br>
      <span style="color: #555;">Marketing Department</span>
    </p>
  </div>
  `,

  text: `
Greetings Management,

I hope you are doing well.

I wanted to inform you that today I have scheduled a meeting with a new client ${client[0].firstname} ${client[0].surname}, who is working at ${client[0].company} as ${client[0].position}.
The purpose of the meeting is to discuss the following:

- Agenda: ${agenda}
- Services: ${servicesString}

I will ensure to keep you updated with any important developments following the meeting.
Please let me know if you have any specific points you would like me to address during this discussion.

Best regards,
${auth.firstname} ${auth.surname}
  `,
};
// ✅ end Send email

                try {
                        const emailCheck = await transporter.sendMail(mailOptions);
                        
                        if ( emailCheck.accepted && emailCheck.accepted.length > 0 ) {
                                                                
                                if (req.xhr) {
                                                return res.json({ success: true, message: "Pipeline added and email sent.", pipelines: allPipelines});
                                        }
                        
                                req.flash("success_msg", "Pipeline added and email sent.");
                                return res.redirect('back');

                                }else{
                        
                                        if (req.xhr) {
                                                return res.json({ success: false, error: ["Pipeline added but email not sent."], pipelines: allPipelines});
                                                        }
                        
                                        req.flash("error_msg", "Pipeline added but email not sent.");
                                        return res.redirect("back");
                                }
                        
                } catch (emailErr) {
                        console.error("❌ Failed to send email:", emailErr);
                        return apiResponse.error(req, res, ["Internal Server Error"], 500);
                }

                                }
                        }

                        return apiResponse.error(req, res, ["Failed to add pipeline."]);
                }

            } catch (error) {
                      console.log(error);
                      return apiResponse.error(req, res, ["Internal server error"], 500);
                }
        }

        }