const express = require("express");
const router = express.Router();
const { Messages } = require("../models");

const PASSWORD = process.env.PASSWORD;

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

router.get("/:password", async (req, res) => {
  const { password } = req.params;
  if (password !== PASSWORD) {
    return res.status(401).json({
      message: "Unauthirzed",
    });
  }
  const listOfMessages = await Messages.findAll();
  res.json(listOfMessages);
});

router.post("/", async (req, res) => {
    const { name, email, text} = req.body;    
  try {
    if(!name || !email || !text){
        return res.status(400).json({ error: "Please fill all the fields" });
    }
      const newMessage = await Messages.create({
          name,
          email,
          text,
        
      });
      const msg = {
        to: email, // Change to your recipient
        from: 'os778ama@gmail.com', // Change to your verified sender
        subject: 'Message Received',
        text: `hello ${name}, your message has been received. and we will get back to you soon.`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
      res.json(newMessage);
  } catch (error) {
      res.status(500).json({ error: "Failed to send a message" });
  }
});

module.exports = router;