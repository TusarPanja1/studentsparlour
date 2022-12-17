import React, { useEffect, useState } from 'react'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';





const Table = (props) => {
  useEffect( ()=>{
    document.getElementsByClassName('ag-theme-alpine').visibility='visible'
  });
  const [gridApi,setGridApi]=useState(null);
  const [gridColumnApi,setGridColumnApi]=useState(null);

  var columns= props.column;
  var rows= props.row;
  var col = []
  //create headers columns
  {for(let i=0;i<3;i++){
    col.push({headerName: columns[i], field: columns[i],width: 150,resizable: true, sortable: true, filter: true,pinned: 'left'})
  }}
  {for(let i=3;i<columns.length-1;i++){
    col.push({headerName: columns[i], field: columns[i],width: 150,tooltipField: columns[1]})
  }}
  col.push({headerName: columns[columns.length-1], sortable: true,width: 150,field: columns[columns.length-1],pinned: 'right'})
  
  function onGridReady(params){
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }
  //quick filter to search on table
  const handleQuickFilter = (event) => {
    gridApi.setQuickFilter(event.target.value);
  };
  //filter on month
  const handleChange = event => {
    for(let i=0;i<columns.length;i++)
    {
      gridColumnApi.setColumnVisible(`${columns[i]}`,true)
    }
    let value=event.target.value

    for(let i=3;i<columns.length;i++)
    {
      
      if(!(columns[i].startsWith(value,3)))
      {
        gridColumnApi.setColumnVisible(`${columns[i]}`,false)
      }
       
    }
  };

  return (
   
    <div className='ag-theme-alpine' 
    style={{
      height: '500px',
      width: '100%',
      
    }}
    visibility='hidden'
    >
      <div className='container' >
        <select onChange={handleChange}>
          <option value="" disabled selected>Select month</option>
          <option value="">Show all</option>
          <option value="01">January</option>
          <option value="02">Febrauary</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>

        </select>
      <input type="search"  onChange={handleQuickFilter} placeholder="Search Here... "/>
      </div>
      <AgGridReact 
      style={{ width: '100%', height: '100%;' }}
      onGridReady={onGridReady}
      rowData={rows} 
      columnDefs={col} 
      pagination={true}
      animateRows={true} 
      sideBar={true}
      paginationPageSize={50} 
      enableBrowserTooltips={true}
      defaultColDef={{
        flex: 1,
        minWidth: 150,
      }}
      />
    </div>
    
  )
}

export default Table