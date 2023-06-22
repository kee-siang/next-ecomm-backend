import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export function sendMail() {

    const text = 'Welcome to PhotoBook ~~' +
                 'Dear user, kindly inform that your account is created successfully.' +
                 'You may go to our website and purchase the image you like right now!!.'
 
    const html = '<strong>Welcome to PhotoBook ~~ </strong>' +
             '<p>Dear user, kindly inform that your account is created successfully.</p>' +
             '<p>You may go to our website and purchase the image you like right now!!.</p>';

    const msg = {
        to: 'tksiang123@outlook.com', // Change to your recipient
        from: 'tksiang.ss@gmail.com', // Change to your verified sender
        subject: 'Welcome to PhotoBook ~~ Sign Up Confirmation ~~',
        text: text,
        html: html
    }

    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}