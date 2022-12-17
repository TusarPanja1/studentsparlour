import React,{useState} from 'react'
import axios from 'axios'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Table from './Table'

const hero = () => {
  
    

    const [fileData, setFileData] = useState("");
    const [fileName, setFileName] = useState("");
    const [column, setColumn] = useState([]);
    const [row, setRow] = useState([]);
    const [flag, setFlag] = useState(false);
    const handleChange = (e) => {
      setFileData(e.target.files[0]);
      setFileName(e.target.files[0].name);
    };
    
    //This Function will send request to upload file  
    const handleSubmit = async (e) => {
        
        e.preventDefault(); 
        
        const data = new FormData();
        data.append("file", fileData);
        data.append("fileName",fileName);
        //validation to check csv format or return false
        var allowedExtensions =
                    /(\.csv)$/i;
             
            if (!allowedExtensions.exec(fileName)) {
              document.getElementById('contained-button-file').value='';
              notify("false")
                return;
            }
        axios({
          method: "POST",
          url: "http://localhost:3000/upload",
          data: data,
        }).then((res) => {       
            console.log(res.data)
            
            notify("success")
        });
    }
    const notify = (arg) => {
        if (arg === 'success') {
            toast.success('File Uploaded Succesfully')
        } else if("false")  {
            toast.error('Please upload csv file only')
        }
        else{
          toast.error('Please! Check Upload format')
        }
    }
    
    
    //fetch data from database into table
    const handleTable = async (e) => {
        
        e.preventDefault();   
        if (document.getElementById('contained-button-file').value=='') { 
          warning("false")
            return;
        }
        document.getElementById('contained-button-file').value='';
        axios({
          method: "POST",
          url: "http://localhost:3000/table",
        
        }).then((res) => {  
            
            
          setColumn(res?.data?.data?.headers)
          setRow(res?.data?.data?.response)
          setFlag(true)
            warning("success")
        });
        
    }
    const warning = (arg) => {
        if (arg === 'success') {
            toast.success('File Tabled Succesfully')
        } else if('false')  {
            toast.error('Please upload a file to show data')
        }
        else{
          toast.error('Sorry! File is not Tabled')
        }
    }
  
  return (
    

   
    <><div className='hero'>
      <p><strong>Upload Format: </strong> CSV file with ',' separated id,name,email,dates with value 0 for absent and 1 for presents (e.g. '01-01-2000' with values 0 or 1) </p>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
        {/* form to upload file and fetch from database  */}
      <form style={{marginTop:"10px"}} method='post' onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          name="uploadFile"
          id="contained-button-file"
          onChange={handleChange}
          required />
        <button type="submit" style={{marginRight:"10px"}}>Submit</button>
        <button onClick={handleTable}>Show Data</button>
      </form>

    
    </div>
    {(flag)?(<Table column={column} row={row} />):<div className='table-container'><strong>Upload CSV File</strong></div>}
    
    
    </> 
  )
}

export default hero