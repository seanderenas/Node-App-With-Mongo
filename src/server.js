const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const expressLayouts = require('express-ejs-layouts')
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express()

const favicon = require('serve-favicon');
ObjectID = require('mongodb').ObjectID

/* ~~~~~~~~ LINK TO DB ~~~~~~~~~~~ */
const connectionString = "mongodb+srv://seanderenas:MUmYgXxLMP6DgJLQ@cluster0.czeqqpu.mongodb.net/";
MongoClient.connect(connectionString)
  .then(client => {
    const db = client.db('PersonalProjectDB')
    const contactFormCollection = db.collection('contactForm')
    const porfolioEntryCollection = db.collection('porfolioEntry');
    console.log(`Connected to Database`)
    
    /* ~~~~~~~~ SETTINGS ~~~~~~~~~~~ */
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs')
    app.set('layout', './layouts/application')
  
    /* ~~~~~~~~ MIDDLEWARE ~~~~~~~~~~~ */
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(expressLayouts)
    app.use(express.static(__dirname + '/public'))
    app.use('/public/images', express.static(__dirname + '/public/images'));
    app.use(favicon(__dirname + '/public/images/icons/favicon.ico'));
    app.use(fileUpload());
    app.use('/', (req, res, next) => {
      console.log(`${req.method} ${req.path}`)
      next()
    })

    /* ~~~~~~~~ ROUTEs ~~~~~~~~~~~ */
    app.get('/', (req, res) => {
      res.render('index', {cssFileName: "styles.css", title: "Sean's Portfolio Website", descripton: "Main page of Sean Derenas's portfolio website, scroll down to learn about me and see my projects." })
    });
    app.get('/signin', (req, res) => {
      res.render('signin', {cssFileName: "styles.css", title: 'Sign In Page', descripton: "Please enter your credentials to sign in." })
    });
    app.get('/createPortfolio', (req, res) => {
      porfolioEntryCollection.find().toArray()
        .then(portfolioEntry => {
          res.render('createPortfolio', { portfolios: portfolioEntry, cssFileName: "styles.css", title: 'Create Porfolio Entries', descripton: "Enter information in to create more entries into the portfolio database." })
        })
        .catch(error => console.error(error))
    })
    
    app.post('/createPortfolio', (req, res) => {
      /* used for finding all files in dir (will use later)
      fs.readdirSync(__dirname +'/public/images/icons/').forEach(file => {
        console.log(file);
      }); */

      console.log(req.body);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
      console.log(req.files.sampleFile);

      let uploadedFiles = req.files.sampleFile;
      let uploadPath;
      
      
      //make dir with portfolio title name
      fs.access(`${__dirname}/public/images/portfolio/`, (error) => { 
        console.log(`Accessed: ${__dirname}/public/images/portfolio/`)
        // To check if the given directory already exists or not 
        if (!error) { 
          // If current directory does not exist then create it 
          fs.mkdir(`${__dirname}/public/images/portfolio/${req.body.title}`, (error) => { 
            if (error) { 
              console.log(error); 
            } else { 
              console.log("New Directory created successfully !!"); 
              uploadFileTofolder();
            } 
          }); 
        } else { 
          console.log("Given Directory already exists !!"); 
        } 
      }); 
      
      // Use the mv() method to place the file somewhere on your server
      async function uploadFileTofolder(){
        for(let i=0; i<uploadedFiles.length; i++){
          uploadPath = `${__dirname}/public/images/portfolio/${req.body.title}/${uploadedFiles[i].name}`;
          console.log(`trying to added '${uploadedFiles[i].name}' to '${uploadPath}'`);
          let file = uploadedFiles[i];
          file.mv(uploadPath, function(err) {
            if (err)
              return res.status(500).send(err);       

            console.log(`Created folder named: ${req.body.title}`)
          });
        }
      }
      porfolioEntryCollection.insertOne(req.body)  
        .then(result => {
          res.redirect('/createPortfolio')
        })
        .catch(error => console.error(error))
    })

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
          res.render('contactForms.ejs', { contactForms: forms, cssFileName: "styles.css", title: "All contact forms", descripton: "Shows all contact forms sent by users." })
        })
        .catch(error => console.error(error))
    })

    app.get('/portfolio', (req, res) => {
      res.render('portfolio', { title: 'Porfolio Page', cssFileName: "styles.css", descripton: "Page containing all my projects i want to show off." })
    })

    /* ~~~~~~~~ LISTEN ~~~~~~~~~~~ */
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)
