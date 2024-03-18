const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const expressLayouts = require('express-ejs-layouts')
const app = express()
ObjectID = require('mongodb').ObjectID

/* ~~~~~~~~ LINK TO DB ~~~~~~~~~~~ */
const connectionString = "mongodb+srv://seanderenas:MUmYgXxLMP6DgJLQ@cluster0.czeqqpu.mongodb.net/"
MongoClient.connect(connectionString)
  .then(client => {
    const db = client.db('PersonalProjectDB')
    const contactFormCollection = db.collection('contactForm')
    console.log(`Connected to Database`)
    
    /* ~~~~~~~~ SETTINGS ~~~~~~~~~~~ */
    app.set('view engine', 'ejs')
    app.set('layout', './layouts/application')
  
    /* ~~~~~~~~ MIDDLEWARE ~~~~~~~~~~~ */
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(expressLayouts)
    app.use(express.static('public'))
    app.use('/public/images/', express.static('./public/images'));
    app.use('/', (req, res, next) => {
      console.log(`${req.method} ${req.path}`)
      next()
    })

    /* ~~~~~~~~ ROUTEs ~~~~~~~~~~~ */
    app.get('/', (req, res) => {
      res.render('index.ejs', { title: "Main Page", descripton: "Main page of Sean Derenas's personal website." })
    });
    app.get('/signin', (req, res) => {
      res.render('signin', { title: 'Sign In Page', descripton: "Please enter your credentials to sign in." })
    });
    
    app.post('/contact', (req, res) => {
      contactFormCollection.insertOne(req.body)  
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    app.get('/contactForms', (req, res) => {
      db.collection('contactForm').find().toArray()
        .then(forms => {
          res.render('contactForms.ejs', { contactForms: forms, title: "All contact forms", descripton: "Shows all contact forms sent by users." })
        })
        .catch(error => console.error(error))
    })

    app.get('/portfolio', (req, res) => {
      res.render('portfolio', { title: 'Porfolio Page', descripton: "Page containing all my projects i want to show off." })
    })

    /* ~~~~~~~~ LISTEN ~~~~~~~~~~~ */
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)
