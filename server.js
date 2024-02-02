const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const expressLayouts = require('express-ejs-layouts')
const app = express()
ObjectID = require('mongodb').ObjectID

// ========================
// Link to Database
// ========================
// Updates environment variables
// @see https://zellwk.com/blog/environment-variables/
//require('./dotenv')

// Replace process.env.DB_URL with your actual connection string
const connectionString = "mongodb+srv://seanderenas:PY6TMYWTD9SSeksq@cluster0.czeqqpu.mongodb.net/"

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('PersonalProjectDB')
    const eventsCollection = db.collection('events')

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(expressLayouts)
    app.set('layout', './layouts/application')
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================
    app.get('/', (req, res) => {
      db.collection('events').find().toArray()
        .then(events => {
          res.render('index.ejs', { events: events, title: "Main Page", descripton: "Main page of Sean Derenas's personal website." })
        })
        .catch(/* ... */)
    })

    app.post('/events', (req, res) => {
      eventsCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/events')
        })
        .catch(error => console.error(error))
    })

    app.get('/events', (req, res) => {
      db.collection('events').find().toArray()
        .then(events => {
          res.render('events.ejs', { events: events, title: "All Events", descripton: "Shows all events created by users." })
        })
        .catch(/* ... */)
    })

    app.get('/about', (req, res) => {
      res.render('about', { title: 'About Page', descripton: "Explains who i am and my experience coding." })
    })

    app.get('/contact', (req, res) => {
      res.render('contact', { title: 'Contact Page', descripton: "How to contact me" })
    })
    app.get('/portfolio', (req, res) => {
      res.render('portfolio', { title: 'Porfolio Page', descripton: "Page containing all my projects i want to show off." })
    })

    /*app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    }) */

    // ========================
    // Listen
    // ========================
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)
