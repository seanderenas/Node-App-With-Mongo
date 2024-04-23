const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const expressLayouts = require('express-ejs-layouts')
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
const GridFSBucket = require("mongodb").GridFSBucket
const fs = require('fs');
const app = express()
require('dotenv').config()
const favicon = require('serve-favicon');
const { title } = require('process')
ObjectID = require('mongodb').ObjectID

const url = process.env.MONGO_KEY

/* ~~~~~~~~ LINK TO DB ~~~~~~~~~~~ */
MongoClient.connect(url)
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
    //app.use(fileUpload());
    app.use('/', (req, res, next) => {
      let logData = `[ ${new Date().toISOString()} ] [${req.ip}] [${req.method}] [${req.path}] [${req.headers['accept-language']}] [${req.headers['user-agent']}] \n`;
      //console.log(req.headers)
      if( !req.path.includes('/download/')){
        fs.appendFile('logs.txt', logData, function (err) { 
          if (err) throw err; 
          console.log('logged data'); 
        }); 
      }

  
      next()
    })

    /* ~~~~~~~~ CREATE BUCKET USED AS STORAGE ~~~~~~~~~~~ */
    const storage = new GridFsStorage({
      url,
      file: (req, file) => {
        //If it is an image, save to photos bucket
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
          console.log('Image uploaded with ');
          return {
            bucketName: "photos",
            filename: `${Date.now()}_${file.originalname}`,
            portfolioName: ''
          }
        } else {
          //Otherwise save to default bucket
          return `${Date.now()}_${file.originalname}`
        }
      },
    })

    // Set multer storage engine to the newly created object
    const upload = multer({ storage })

    app.post("/uploadImages", upload.array('file', 5) , function (req, res, next) { 
      const files = req.files

      const database = client.db("test")
      const images = database.collection("photos.files")

      for(let i=0; i<files.length; i++){
        console.log(`File Name: ${files[i].filename}`);
        images.updateOne({"filename" : files[i].filename }, { "$set": {portfolioTitle: req.body.title} });
        
      }
      //after uploading images enter form data to other collection
      porfolioEntryCollection.insertOne(req.body)  
      .then(result => {
        renderWithImagesAndPortfolios('index', {menu: 'public', cssFileName: "styles.css", title: "Sean's Portfolio Website", descripton: "Main page of Sean Derenas's portfolio website, scroll down to learn about me and see my projects." } , res)
      })
      .catch(error => console.error(error))
      
    })

    /* pass it a file name and json for the res.render but lets you access all images too */
    async function renderWithImagesAndPortfolios(renderFile, jsonDataForFile = [], res) {
      try {
        const database = client.db("test")
        const images = database.collection("photos.files")
        const cursor = images.find({})
        const count = await images.countDocuments();
        if (count === 0) {
          return res.status(404).send({
            message: "Error: No Images found",
          })
        }
        
        const allImages = []
        await cursor.forEach(item => {
          allImages.push(item)
        })

        jsonDataForFile['files'] = allImages;
        
        porfolioEntryCollection.find().toArray()
        .then(portfolioEntry => {
          jsonDataForFile['portfolios'] = portfolioEntry;
          res.render(renderFile, jsonDataForFile);
        })
        .catch(error => console.error(error))

      } catch (error) {
        console.log(error)
        res.status(500).send({
          message: "Error Something went wrong",
          error,
        })
      }
      
    }

    app.get("/images", async (req, res) => {
      renderWithImagesAndPortfolios('images', {menu: 'dev', cssFileName: 'styles.css', title: 'All images', descripton: 'desc.' }, res)
    })

    app.get("/download/:filename", async (req, res) => {
      try {
       
    
        const database = client.db("test")
    
        const imageBucket = new GridFSBucket(database, {
          bucketName: "photos",
        })
    
        let downloadStream = imageBucket.openDownloadStreamByName(
          req.params.filename
        )
    
        downloadStream.on("data", function (data) {
          return res.status(200).write(data)
        })
    
        downloadStream.on("error", function (data) {
          return res.status(404).send({ error: "Image not found" })
        })
    
        downloadStream.on("end", () => {
          return res.end()
        })
      } catch (error) {
        console.log(error)
        res.status(500).send({
          message: "Error Something went wrong",
          error,
        })
      }
    })

    /* ~~~~~~~~ ROUTEs ~~~~~~~~~~~ */
    app.get('/', (req, res) => {
      porfolioEntryCollection.find().toArray()
      .then(portfolioEntry => {
        renderWithImagesAndPortfolios('index', {menu: 'public', portfolios: portfolioEntry, cssFileName: "styles.css", title: "Sean's Portfolio Website", descripton: "Main page of Sean Derenas's portfolio website, scroll down to learn about me and see my projects." }, res)
      })
      .catch(error => console.error(error))
    });
    app.get('/signin', (req, res) => {
      res.render('signin', {menu: 'dev', cssFileName: "styles.css", title: 'Sign In Page', descripton: "Please enter your credentials to sign in." })
    });
    app.get('/createPortfolio', (req, res) => {
      porfolioEntryCollection.find().toArray()
        .then(portfolioEntry => {
          res.render('createPortfolio', {menu: 'dev', portfolios: portfolioEntry, cssFileName: "styles.css", title: 'Create Porfolio Entries', descripton: "Enter information in to create more entries into the portfolio database." })
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
          res.render('contactForms.ejs', {menu: 'dev', contactForms: forms, cssFileName: "styles.css", title: "All contact forms", descripton: "Shows all contact forms sent by users." })
        })
        .catch(error => console.error(error))
    })

    app.get('/portfolio', (req, res) => {
      renderWithImagesAndPortfolios('portfolio', {menu: 'public', title: 'Porfolio Page', cssFileName: "styles.css", descripton: "Page containing all my projects i want to show off." } , res)
    })

    /* ~~~~~~~~ LISTEN ~~~~~~~~~~~ */
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)