const nodemailer = require("nodemailer");

let transporter;
let mailing_service_success = false;

if (!process.env.GMAIL_ADDRESS || !process.env.GMAIL_PASS) {
	console.warn("GMAIL_ADRESS and GMAIL_PASS not specified, email service will not work.");
	transporter = null;
} else {
	/**
     * Creating the email transporter
     * Setting connection to pooled so that the connection is reused
     * rateLimit is set to 1, which with the default value of 1000 (1 second) of rateDelta limits the sending to 1 email per second - trying to ensure there is no overload
     * (There is no problem in email sending being slow, we just want it to be automatic)
     */
	transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.GMAIL_ADDRESS,
			pass: process.env.GMAIL_PASS,
		},
		pool: true,
		rateLimit: 1,
	});

	// Verifying if the connection was made successfully
	transporter.verify((error, success) => {
		if (error) {
			mailing_service_success = false;
			console.error("Error in connecting to mailing service: ", error);
		} else {
			mailing_service_success = true;
			console.log("The mailing service is ready to receive messages! (success: ", success, ")");
		}
	});
}

// Yes, it is really necessary to use tables, float:left is not supported by most email clients, only table layouts (we dare not even NOT use inline styles)

const signature = `
<div style='margin-top:20px;'>
    <table>
        <tbody>
            <tr>
                <td rowspan="4">
                    <img style="margin-right:20px;" src='cid:id_1234698' alt='logo niaefeup' title='logo' style='display:block' width='94'>
                </td>
                <td>
                    <h2 style="margin-bottom:0;">Núcleo de Informática da AEFEUP</h2>
                </td>
            </tr>
            <tr>
                <td><p style="margin-top:5px;"><a href='mailto:ni@aefeup.pt'>ni@aefeup.pt</a></p></td>
            </tr>
            <tr>
                <td>
                    <p style="margin-top:10px;"><a href='https://ni.fe.up.pt'>Website</a> | <a href='https://www.facebook.com/NIAEFEUP'>Facebook</a> | <a
                    href='https://www.instagram.com/niaefeup/'>Instagram</a></p>
                </td>
            </tr>
            <tr>
                <td><p style="margin-top:10px;"> Sala B315, Rua Dr.Roberto Frias, s/n 4200-465 Porto Portugal | <a href='https://goo.gl/maps/aj2LBqFkwjx'>Google
                    Maps</a></p></td>
            </tr>
        </tbody>
    </table>
</div>`;

/**
 * Wrapper around the email signature to ensure that it is not changed accidentally
 */
const getSignature = () => {
	return signature;
};

/**
 * Wrapper in order to send email always using the same transporter. Automatically appends the email signature.
 * @param {*} mailOptions The email options, as per nodemailer documentation
 * @param {*} callback Callback with the arguments (err, info) that will be passed to nodemailer
 */
const sendMail = (mailOptions, callback) => {
	if (!mailing_service_success) {
		console.error("Attempting to send email when the connection test failed, aborting!");
		return;
	}

	if (!process.env.GMAIL_ADDRESS || !process.env.GMAIL_PASS) {
		console.error("Attempted to send email without defining GMAIL_ADDRESS and GMAIL_PASS, aborting!");
		return;
	}

	if (!mailOptions) {
		console.error("Attempted to send email without mailOptions specified, aborting!");
		return;
	}

	if (!mailOptions.to && !mailOptions.bcc && !mailOptions.cc) {
		console.error("Attempted to send email without recipients (to, cc, bcc), aborting!");
		return;
	}

	if (!mailOptions.subject) {
		console.error("Attempted to send email without subject, aborting!");
		return;
	}

	if (!mailOptions.html) {
		console.error("Attempted to send email without HTML body (plaintext is not being used due to the signature), aborting!");
		return;
	}

	if (!mailOptions.from) {
		mailOptions.from = process.env.GMAIL_ADDRESS;
	}

	// Adding the signature
	mailOptions.html += getSignature();

	// Adding the logo to the attachments
	if (!mailOptions.attachments || !(mailOptions.attachments instanceof Array)) {
		mailOptions.attachments = [];
	}

	mailOptions.attachments.push({
		filename: "logo-niaefeup.png",
		path: "https://ni.fe.up.pt/images/logo-niaefeup.png",
		cid: "id_1234698",
	});

	// A default callback is defined to simplify handling response
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.error("Error sending emails: ", err);
		} else {
			console.log("Email(s) successfully sent, response: ", info.response);
			console.log("debug", info); // TODO: Remove probably
			console.log(`${info.accepted.length} emails were accepted and ${info.rejected.length} were rejected.`);
		}

		// Calling the passed callback for email status, if it exists
		callback && callback(err, info);
	});
};

module.exports = {
	sendMail, getSignature,
};
