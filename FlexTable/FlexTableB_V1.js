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
        height:200px;
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
        <div id="my_data">...</div>
      </div>
    `
    function toCommas(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class FlexTableB_V1 extends HTMLElement {
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
    async render (resultSet, type, nmonths) {
      
      this._placeholder = this._root.querySelector('#placeholder')
      if (this._placeholder) {
        this._root.removeChild(this._placeholder)
        this._placeholder = null
      }
      
      // Table Wrapper & Scrollbar definition
      var table_output = '<div id="table-wrapper"><div id="table-scroll">'
      
      // Table Headers & Body
      table_output += '<table><thead><tr><th>Order Date</th>'
      table_output += '<th>Gross Margin</th><th>Difference</th><th>Δ%</th></tr></thead><tbody>'
      
      // initialize counter of cells
      var counterCells = 1
      
      // Measures values initialization
      var cValueGM = " - "
      
      console.log('----------------')
      
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      // Loop through the resultset delivered from the backend vvvvvvvvvvvv
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv 
      
      var monthArray = [];

      resultSet.forEach(dp1 => {
          console.log(dp1)
          var cDimension = dp1['19929390-5897-4181-9551-350442615312']
          var cOrderDate = cDimension['description']
          var { rawValue, description } = dp1['@MeasureDimension']
          var monthValue = cOrderDate + '/' + rawValue
          
          monthArray.push(monthValue)
      })
      
      console.log('quarterArray:')
      console.log(quarterArray)
      
      console.log('----------------')

      resultSet.forEach(dp2 => {
          //console.log(dp2)
        
          var cDimension = dp2['19929390-5897-4181-9551-350442615312']
          var cOrderDate = cDimension['description']
          
          let year_plus_1 = String(Number(cQuarter.substring(0, 4)) + 1) + '.' + cQuarter.substring(5, 7) 
        
          // Get the description & formattedValue from the measures (@MeasureDimension)
          var { rawValue, formattedValue, description } = dp2['@MeasureDimension']
              
          console.log(cOrderDate)
          console.log(rawValue)
          console.log(year_plus_1)
        
          var cDiff = '-'
          var cPercentage = '-' 
        
          for (var index=0; index<monthArray.length; index++) {
            if (monthArray[index].includes(year_plus_1)) {
              let position = index
              console.log(position)
              console.log(monthArray[index])
              let year_plus_1_value = monthArray[index].substring(8, 20)
              
              let cDiffNumber = Number(year_plus_1_value) - Number(rawValue)
              cDiffNumber = cDiffNumber.toFixed(2)                // only 2x decimal places
              
              let cPercentageNumber = 100 - ((Number(rawValue) * 100) / Number(year_plus_1_value))
              cPercentageNumber = (cPercentageNumber.toFixed(1)) * -1
              cPercentage = String(cPercentageNumber) + '%'
              
              cDiffNumber = cDiffNumber * -1
              cDiff = toCommas(cDiffNumber)                       // from number = 1234567890.12  to  1,234,567,890.12
              
              console.log(year_plus_1_value)
              console.log(cDiff)
              console.log(cPercentage)
              break
            }
          }
        
          // First cell
          if (counterCells === 1)
          {
              cValueGM = formattedValue
          }

          // Increment the cells counter
          counterCells = counterCells + 1
     
          // Reset the counter for each row
          if (counterCells>1) 
          {
            // Write into table all dimensions at once (one go only)
            /////////////table_output += '<td><font style="font-size:12px;">'+ cQuarter +'</font></td>'
             // Write into table all measures at once
            /////////////table_output += '<td><font style="font-size:12px;">'+ cValueGM +'</font></td>'
            /////////////table_output += '<td><font style="font-size:12px;">'+ cDiff +'</font></td>'
            /////////////table_output += '<td><font style="font-size:12px;">'+ cPercentage +'</font></td>'

            // Close each row
            ///////////// table_output += '</tr>'

            // Moved into a different country and
            // Reset the counter, to start a new row
            counterCells = 1
          }
        
        
      }) // END of loop --> resultSet.forEach(dp => {
    
      //Close all used tags
      /////////////table_output += '</tbody></table></div></div>'
    
      // replace above element "my_data" with the HTML table output (final HTML table built above)
      /////////////this._shadowRoot.getElementById('my_data').innerHTML = table_output
      
      // to avoid memory issues, release from memory the huge HTML string (table_output)
      table_output = ''
      dp1 = ''
      dp2 = ''
      
    } // END of method --> render
    
  } // END of class myNewTable
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-flextableb', FlexTableB_V1)
  
})() // END of function --> (function () {
