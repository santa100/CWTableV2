(function () {
  const template = document.createElement('template')
  template.innerHTML = `
      <style>
      #root {
        background-color: white;  
      }
      #placeholder {
        padding-top: 1em;
        text-align: center;
        font-size: 1.5em;
        color: black;
      }
      
      ///////////////////////////////////////////////////////////////
      // Table CSS classes
      ///////////////////////////////////////////////////////////////
      
      table {
        font-family: arial, sans-serif;
        /* font-size: 15px; */
        border-collapse: collapse;
        width: 100%;
      }
      
      /* HEADER DEFINITION */
      th{ 
        position: sticky;   /* Freeze Header */
        top: 0px;           /* Don't forget this, required for the stickiness */
        border-bottom: 1px solid black;
        text-align: left;
        padding: 8px;
        
        background: white; /* Header background color */
        color: black;      /* Header text color */
      }
      
      /* CELL DEFINITION */
      td{
        border-bottom: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      
      ///////////////////////////////////////////////////////////////
      // Scrollbar necessary CSS classes
      ///////////////////////////////////////////////////////////////
      #table-wrapper {
        position:relative;
      }
      #table-scroll {
        height:500px;
        overflow:auto;  
        margin-top:20px;
      }
      #table-wrapper table {
        width:100%;
      }
      #table-wrapper table * {
        color:black;
      }
      #table-wrapper table thead th .text {
        position:absolute;   
        top:-20px;
        z-index:2;
        height:100%;
        width:100%;
        border:1px solid black;
      }
      ///////////////////////////////////////////////////////////////
      
      </style>
      <div id="root" style="width: 100%; height: 100%;">
        <div id="my_data">Your table is being prepared. Please wait a few seconds.</div>
      </div>
    `
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class myNewTableB25 extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')
      this._props = {}
    }
  
    // ------------------
    // Scripting methods
    // ------------------
    async render (resultSet) {
      
      this._placeholder = this._root.querySelector('#placeholder')
      if (this._placeholder) {
        this._root.removeChild(this._placeholder)
        this._placeholder = null
      }
      
      // Table Wrapper & Scrollbar definition
      var table_output = '<div id="table-wrapper"><div id="table-scroll">'
      
      // Table Headers & Body
      table_output += '<table><thead><tr><th>Start Date</th><th>Order Id</th><th>Order Type</th><th>Product</th><th>Batch</th><th>End Date</th>'
      table_output += '<th>Pack Size</th><th>Folding Box</th><th>Leaflet</th><th>Vial Size</th><th>Comments</th>'
      table_output += '<th>Quantity</th><th>Step Duration</th></tr></thead><tbody>'
      
      // initialize counter of cells
      var counterCells = 1
      
      // initialize country duplicate control
      var previousCountry = ''
      
      // Control first row only
      var firstRow = true
      
      // Measures values initialization
      var cValueQuantity = " - "
      var cValueStepDuration = " - "
      
      console.log('----------------')
      
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      // Loop through the resultset delivered from the backend vvvvvvvvvvvv
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv      

      resultSet.forEach(dp => {
          //console.log(dp)
        
          var cDimension = dp['/ROH/OPSSTDAT']
          var cStartDate = cDimension['description']
          cDimension = dp['/ROH/OPSOERID']
          var cOrderId = cDimension['description']
          cDimension = dp['/ROH/OPSODTY']
          var cOrderType = cDimension['description']
          cDimension = dp['/ROH/OPS0PRODC']
          var cProduct = cDimension['description']
          cDimension = dp['HQ0BAT2H']
          var cBatch = cDimension['description']
          cDimension = dp['/ROH/OPSENDAT']
          var cEndDate = cDimension['description']
          cDimension = dp['/ROH/OPS0PRODC__/ROH/OPSPACKS']
          var cPackSize = cDimension['description']
          cDimension = dp['/ROH/OPS0PRODC__/ROH/OPSFOLDB']
          var cFoldingBox = cDimension['description']
          cDimension = dp['/ROH/OPS0PRODC__/ROH/OPSLEAFLT']
          var cLeaflet = cDimension['description']
          cDimension = dp['/ROH/OPS0PRODC__/ROH/OPSVIASZ']
          var cVialSize = cDimension['description']
          cDimension = dp['4B7H&OPSCP07N-ALLCOMMENTS']
          var cComments = cDimension['description']
            
          // Get the description & formattedValue from the measures (@MeasureDimension)
          var { formattedValue, description } = dp['@MeasureDimension']
              
          // First cell
          if (counterCells === 1)
          {
              cValueQuantity = formattedValue
          } else if (counterCells === 2)
          {
              cValueStepDuration = formattedValue
          }

          // Increment the cells counter
          counterCells = counterCells + 1
     

          // Reset the counter for each row
          if (counterCells>2) 
          {
            // Write into table all dimensions & measures at once (one go only)
            table_output += '<td><font style="font-size:12px;">'+ cStartDate +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cOrderId +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cOrderType +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cProduct +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cBatch +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cEndDate +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cPackSize +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cFoldingBox +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cLeaflet +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cVialSize +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cComments +'</font></td>'

            table_output += '<td><font style="font-size:12px;">'+ cValueQuantity +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cValueStepDuration +'</font></td>'

            // Close each row
            table_output += '</tr>'

            // Moved into a different country and
            // Reset the counter, to start a new row
            counterCells = 1
          }
        
      }) // END of loop --> resultSet.forEach(dp => {
    
      //Close all used tags
      table_output += '</tbody></table></div></div>'
    
      // replace above element "my_data" with the HTML table output (final HTML table built above)
      this._shadowRoot.getElementById('my_data').innerHTML = table_output
      
      // to avoid memory issues, release from memory the huge HTML string (table_output)
      table_output = ''
      
    } // END of method --> render 
  } // END of class myNewTable
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-newtableb25', myNewTableB25)
  
})() // END of function --> (function () {
