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
                
                
                dbname=req.file.filename;
                dbname=dbname.replace('.csv','');
              //drop if existing or upload
                var check=`DROP TABLE IF EXISTS \`${dbname}\`;`;
                connection.query(check, (error, response) => {
                      console.log(error );})

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
                      console.log(error );})
                      Headers.push('Total')

                //load csv to database
                    let filepath='C:/xampp/mysql/data/studentparlour/';
                    let qry =
                    `LOAD DATA INFILE '${filepath}${req.file.filename}' INTO TABLE ${dbname} FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES;`;
                    connection.query(qry, (error, response) => {
                      console.log(error ); 
                    });
                    let total= `UPDATE ${dbname} SET Total=`
                    for ( let i = 3; i < Headers.length; i++){
                      total =total +`\`${Headers[i]}\` +`;  
                      }
                      total=total.substring(0, total.length - 1);
                      connection.query(total, (error, response) => {
                        console.log(error ); 
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
  
 
    const query = `SELECT * FROM ${db}`;
    connection.query(query , (error, response) => {
      console.log(error );
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
  let value=req.params.id;

  if(value=="All")
  {
    const query = `SELECT * FROM ${dbname}`;
    connection.query(query, (error, response) => {
      console.log(error );
      res.send({
        status: true,
        message: "Data Fetched!",
        data: {
          response:response,
          headers:Headers,
        },
      });
    });
  }
  
  else{
  let headers=[]
  let months=""
  let total=""
  for(let i=0;i<3;i++)
  {
      headers.push(Headers[i])
      months=months+"`"+Headers[i]+"`"+",";
  }
  for(let i=3;i<Headers.length;i++)
  {
    if((Headers[i].startsWith(value,3)))
    {
      headers.push(Headers[i])
      months=months+"`"+Headers[i]+"`"+",";
      total=total+"`"+Headers[i]+"`"+"+";
    } 
  }
  months=months.substring(0, months.length - 1);
  total=total.substring(0, total.length - 1);
  const query = `SELECT ${months},${total} as Total FROM ${dbname}`;
  headers.push('Total')
  connection.query(query , (error, response) => {
    console.log(error );
    //response on fetched
    res.send({
      status: true,
      message: "month!",
      data: {
        response:response,
        headers:headers,
      },
      
      
    });
  });
  
  months=""
  total=""
}
})








app.listen(3000, () => {
  console.log("Server is running on port 3000");
});