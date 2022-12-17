import cors from "cors";
import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import multer from "multer";
import csv from "csvtojson";

const app = express();
//upload file to local directory
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/xampp/mysql/data/studentparlour/')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname) 
  }
})

var upload = multer({ storage: storage });
app.use(cors());
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let Headers =[]
let Data=[]
let csvFilePath=""
let dbname=""

var columns=[]
//create connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "studentparlour"
  });
  connection.connect(function(err) {
    if (err) throw err
    
  });
  //upload file
app.post('/upload', upload.single("file"),  (req, res) => {
        try {    
          if (req.file) {
            
           
            csvFilePath = `C:/xampp/mysql/data/studentparlour/${req.file.filename}`;
            
            // convert to json
            csv().fromFile(csvFilePath).then((jsonObj) => {
                Headers=Object.keys(jsonObj[0]);
                Data= Object.values(jsonObj);
                console.log(Headers);
                console.log(Data);
                dbname=req.file.filename;
                dbname=dbname.replace('.csv','');
              //drop if existing or upload
                var check=`DROP TABLE IF EXISTS \`${dbname}\`;`;
                connection.query(check, (error, response) => {
                      console.log(error || response);})

                //create table to upload
                var query=` CREATE TABLE IF NOT EXISTS \`${dbname}\` (`;
                var cols='';
                for ( let i = 0; i < 3; i++){
                    cols =cols +`\`${Headers[i]}\` varchar(50),`;  
                    }
                for ( let i = 3; i < Headers.length; i++){
                    cols =cols +`\`${Headers[i]}\` int(10),`;  
                    }
                    
                query = query + cols+' Total INT(10) DEFAULT 0) ';
                    connection.query(query  , (error, response) => {
                      console.log(error || response);})
                      Headers.push('Total')

                //load csv to database
                    let filepath='C:/xampp/mysql/data/studentparlour/';
                    let qry =
                    `LOAD DATA INFILE '${filepath}${req.file.filename}' INTO TABLE ${dbname} FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES;`;
                    connection.query(qry, (error, response) => {
                      console.log(error || response); 
                    });
                    let total= `UPDATE ${dbname} SET Total=`
                    for ( let i = 3; i < Headers.length; i++){
                      total =total +`\`${Headers[i]}\` +`;  
                      }
                      total=total.substring(0, total.length - 1);
                      connection.query(total, (error, response) => {
                        console.log(error || response); 
                      });
                   
              });
              //response frontend on upload success
              res.send({
                status: true,
                message: "File Uploaded!",
                data: {
                  name: req.file.originalname,
                  mimetype: req.file.mimetype,
                  size: req.file.size,
                  values:Data,
                  headers:Headers,
                },
              });
            }
          //response frontend on failure
           else {
            res.status(400).send({
              status: false,
              data: "File Not Found :(",
            });
          }}catch (err) {
          res.status(500).send(err);
        }
        
    
        
});


// select table from database and retrieve all data
app.post('/table', (req, res) => {
  let db=dbname;
  console.log(db)
 
    const query = `SELECT * FROM ${db}`;
    connection.query(query , (error, response) => {
      console.log(error || response);
      //response on fetched
      res.send({
        status: true,
        message: "Data Fetched!",
        data: {
          response:response,
          headers:Headers,
        },
        
        
      });
    });

})
//response on  filter data
app.get('/filter/:id', (req, res) => {
  var month = req.params.id;
  let db=dbname;
  console.log(db)
  console.log(month)
  console.log(Headers)
  Headers.find(element => {
    if (element.includes(`${month}`)) {
      columns.push(element)
    }
  });
  console.log(columns)
    
    res.send({
      status: true,
      message: `For month ${month}`,
    });
})







app.listen(3000, () => {
  console.log("Server is running on port 3000");
});