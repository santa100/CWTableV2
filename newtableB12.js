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
  class myNewTableB12 extends HTMLElement {
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
      table_output += '<table><thead><tr><th>Order Date</th><th>Region</th><th>Location</th><th>Sales Manager</th><th>Store</th><th>Product</th>'
      table_output += '<th>Gross Margin</th><th>Sales Revenue</th></tr></thead><tbody>'
      
      // initialize counter of cells
      var counterCells = 1
      
      // initialize country duplicate control
      var previousCountry = ''
      
      // Control first row only
      var firstRow = true
      
      // Measures values
      var cValueGrossMargin = " - "
      var cValueSalesRevenue = " - "
      
      console.log('----------------')

      
      var dummy = 0
      
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      // Loop through the resultset delivered from the backend vvvvvvvvvvvv
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv      

      resultSet.forEach(dp => {
          console.log(dp)
        
          if (dummy<10)
          {
              /*
              var cStartDate = dp./ROH/OPSSTDAT.description
              var cOrderId = dp./ROH/OPSOERID.description
              var cOrderType = dp./ROH/OPSODTY.description
              var cProduct = dp./ROH/OPS0PRODC.description
              var cBatch = dp.HQ0BAT2H.description
              var cEndDate = dp./ROH/OPSENDAT.description
              var cPackSize = dp./ROH/OPS0PRODC__/ROH/OPSPACKS.description
              var cFoldingBox = dp./ROH/OPS0PRODC__/ROH/OPSFOLDB.description
              var cLeaflet = dp./ROH/OPS0PRODC__/ROH/OPSLEAFLT.description
              var cVialSize = dp./ROH/OPS0PRODC__/ROH/OPSVIASZ.description
              var cComments = dp.4B7H&OPSCP07N-ALLCOMMENTS.description
              */
              
              /*
              console.log("cStartDate=" + cStartDate)
              console.log("cOrderId=" + cOrderId)
              console.log("cOrderType=" + cOrderType)
              console.log("cProduct=" + cProduct)
              console.log("cBatch=" + cBatch)
              console.log("cEndDate=" + cEndDate)
              console.log("cPackSize=" + cPackSize)
              console.log("cFoldingBox=" + cFoldingBox)
              console.log("cLeaflet=" + cLeaflet)
              console.log("cStartDate=" + cStartDate)
              console.log("cComments=" + cComments)
              */
            
              // Get the description & formattedValue from the measures (@MeasureDimension)
              var { formattedValue, description } = dp['@MeasureDimension']
              
              console.log(" Measure: " + description + "  =   " + formattedValue)
            
              var { id } = dp['/ROH/OPSSTDAT']
              description = dp['/ROH/OPSSTDAT']
              console.log(id)
              console.log(description)
              
          }
        
        
          dummy = dummy + 1
          
       /*

          // Country first cell
          if (counterCells === 1)
          {
              cValueGrossMargin = formattedValue
          } else if (counterCells === 2)
          {
              cValueSalesRevenue = formattedValue
          }

          // Increment the cells counter
          counterCells = counterCells + 1

      */       

          // Reset the counter for each row
          if (counterCells>2) 
          {
            // Write into table all dimensions & measures at once (one go only)
            table_output += '<td><font style="font-size:12px;">'+ cOrderDate +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cRegion +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cLocation +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cSalesMan +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cStore +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cProduct +'</font></td>'

            table_output += '<td><font style="font-size:12px;">'+ cValueGrossMargin +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cValueSalesRevenue +'</font></td>'

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
  customElements.define('com-sap-sample-newtableb12', myNewTableB12)
  
})() // END of function --> (function () {
