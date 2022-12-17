# studentsparlour
Student Parlour is a web application that uses react.js, node.js, and MySQL for database connectivity. The website meets specific requirements for uploading a CSV file and storing it in a database. Obtaining data from the database and storing it in a table with search and filter functionality. As an assignment for a full-stack developer internship with Smart Winnr, this website was developed.

I have use Mysql Express React.js Node.js axios to develop this project

## Map of Assignment with Screenshots
  - Create a React App
I have use vite to create react app as it provide a faster spin-up of the development server. with command 
```npx create vite@latest```
Five components of react is created with names Header, Footer, Table, main, Hero.
In [Header.jsx](https://github.com/TusarPanja1/studentsparlour/blob/main/client/src/Header.jsx) and [Footer.jsx](https://github.com/TusarPanja1/studentsparlour/blob/main/client/src/Footer.jsx) all header code are provided [Hero](https://github.com/TusarPanja1/studentsparlour/blob/main/client/src/Hero.jsx) section consists of two buttons to upload csv and show it from the database.
[Table.jsx](https://github.com/TusarPanja1/studentsparlour/blob/main/client/src/Table.jsx) used for table representation.

![First Page](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(172).png "First page")

- Upload to Database

####now upload file

![Upload](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(173).png "upload page")

####validate csv file and set input field to null

![Upload Validation](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(184).png "upload validation")

####click on submit upload to database check if table is already presented if not then create table and upload with calculating attendence.

![Upload success](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(174).png "upload success")

####database look after upload 

![Database look](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(185).png "database look")

- Fetch form Database to table
####click on show table to show data from database to table

![Table](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(175).png "Table")

#### validation 

![Clicked without adding file](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(183).png "Clicked without adding file")

- Tables Feature

#### sorting filtering with name
![Filter](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(177).png "Filter")

![sort with total](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(179).png "Sort with total")

![Name sort](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(178).png "Name Sort")

- Filter with month

![Filtered Data of January](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(180).png "Filtered Data of January")

![Filtered Data of April](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(181).png "Filtered Data of April")

- Search option

![Search](https://github.com/TusarPanja1/studentsparlour/blob/main/Screenshot%20(182).png "Search with mail with .edu format with expanding column email")

## Steps to run
  - Download or git clone https://github.com/TusarPanja1/studentsparlour.git
  - open client folder ```npm install```
  - create mysql database with name 'studentparlour'
  - open server folder ```npm install```
  - run client   ```npm run dev```
  - run server ```npm start```

## Approach 
  - Upload file ,filename with form and send it to backend with axios
  - create connection
  - fetch file and get headers and data with csvtojson
  - drop table if already exist with filename and create new one with all headers
  - calculate sum of rows and add total to table
  - upload csv to mysql database with created table
  - on click show data fetch data from table separate data and headers
  - send data with headers to table component
  - create columns type add function to add headers to table
  - add search features to table
  - Filter data with monthly filter
  - Validations
    - Check if file type is csv on error show error
    - check if file uploaded, on error show error
    - check data format,on error show error do nothing
    - onclick show data without select file show error
    - on file uploaded successfully show success pop up
    - on file tabled successfully show success pop up
