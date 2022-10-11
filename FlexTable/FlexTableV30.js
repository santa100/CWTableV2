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
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class FlexTableV30 extends HTMLElement {
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
      table_output += '<table><thead><tr><th>Quarters</th>'
      table_output += '<th>Gross Margin</th><th>Difference</th></tr></thead><tbody>'
      
      // initialize counter of cells
      var counterCells = 1
      
      // Measures values initialization
      var cValueGM = " - "
      
      console.log('----------------')
      
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      // Loop through the resultset delivered from the backend vvvvvvvvvvvv
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv 
      
      var quarterArray = [];

      resultSet.forEach(dp1 => {
          var cDimension = dp1['19929390-5897-4181-9551-350442615312']
          var cQuarter = cDimension['description']
          var { rawValue, description } = dp1['@MeasureDimension']
          var quarterValue = cQuarter + '/' + rawValue
          
          quarterArray.push(quarterValue)
      })
      
      console.log('quarterArray:')
      console.log(quarterArray)
      
      console.log('----------------')

      resultSet.forEach(dp2 => {
          //console.log(dp2)
        
          var cDimension = dp2['19929390-5897-4181-9551-350442615312']
          var cQuarter = cDimension['description']
          
          let year_plus_1 = String(Number(cQuarter.substring(0, 4)) + 1) + '.' + cQuarter.substring(5, 7) 
        
          // Get the description & formattedValue from the measures (@MeasureDimension)
          var { rawValue, formattedValue, description } = dp2['@MeasureDimension']
              
          console.log(cQuarter)
          console.log(rawValue)
          console.log(year_plus_1)
        
          var cDiff = '-'
        
          for (var index=0; index<quarterArray.length; index++) {
            if (quarterArray[index].includes(year_plus_1)) {
              let position = index
              console.log(position)
              console.log(quarterArray[index])
              let year_plus_1_value = quarterArray[index].substring(8, 20)
              
              let cDiffNumber = Number(year_plus_1_value) - Number(rawValue)
              cDiffNumber = cDiffNumber.toFixed(2)                            // 2x decimal places
              ///cDiffNumber = cDiffNumber.toLocaleString()              // const number = 1234567890.12;  -->  1,234,567,890.12
              cDiff = toCommas(cDiffNumber)
              
              console.log(year_plus_1_value)
              console.log(cDiff)
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
            table_output += '<td><font style="font-size:12px;">'+ cQuarter +'</font></td>'
             // Write into table all measures at once
            table_output += '<td><font style="font-size:12px;">'+ cValueGM +'</font></td>'
            table_output += '<td><font style="font-size:12px;">'+ cDiff +'</font></td>'

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
    
    function toCommas(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    
  } // END of class myNewTable
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-flextablev1', FlexTableV30)
  
})() // END of function --> (function () {
