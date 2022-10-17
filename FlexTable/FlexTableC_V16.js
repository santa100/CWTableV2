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
      
      .myLightGreen {
         color: #e1f5e1;
      }
      .myLightRed {
         color: #fcd9e1;
      }
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
        height:350px;
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
    
    // Function to FORMAT a number properly with comas (,) and dot (.)
    // Expected FORMAT: 1,234,567,890.12
    function toCommas(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // HTML extension with all necessary logic(s) wrtitten JS                  vvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  
  class FlexTableC_V15 extends HTMLElement {
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
    async render (resultSet, type, timecounter, timerange, sorting) {
      
      this._placeholder = this._root.querySelector('#placeholder')
      if (this._placeholder) {
        this._root.removeChild(this._placeholder)
        this._placeholder = null
      }
      
      // Table Wrapper & Scrollbar definition
      var table_output = '<div id="table-wrapper"><div id="table-scroll">'
      
      // Table Headers & Body
      table_output += '<table><thead><tr><th>Order Date</th><th>Gross Margin</th>'
      if (type === 'Future')
      {
        table_output += '<th>Future Date</th><th>Future Gross Margin</th><th>Difference</th><th>Δ%</th></tr></thead><tbody>'
      } else {
        table_output += '<th>Past Date</th><th>Past Gross Margin</th><th>Difference</th><th>Δ%</th></tr></thead><tbody>'
      }
        
      // initialize counter of cells
      var counterCells = 1
      
      // Measures values initialization
      var cValueGM = " - "
      
      console.log('----------------')
      
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      // Loop through the resultset delivered from the backend                   vvvvvvvvvvvv
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv 
      
      // Necessray temp arrays
      var dataArray = []
      var dataArraySort = []

      // Retrieve into array: dataArray all necessary dates & rawvalue to be used later on the next forEach loop logic
      resultSet.forEach(dp1 => {
          //console.log(dp1)
          var cDimension = dp1['Order_Date']
          var cOrderDate = cDimension['id']
          var { rawValue, description } = dp1['@MeasureDimension']
          var monthValue = cOrderDate + '/' + rawValue
          
          dataArray.push(monthValue)
      })
      
      //console.log('dataArray:')
      //console.log(dataArray)
      
      //console.log('type='+type)
      //console.log('timecounter='+timecounter)
      //console.log('timerange='+timerange)

      // Lopp through each value
      resultSet.forEach(dp2 => {
          //console.log(dp2)
        
          var cDimension = dp2['Order_Date']
          var cOrderDate = cDimension['id']
          
          if (timerange === 'Months')
          {
              let current_month = Number(cOrderDate.substring(5, 7))
              var year_txt = cOrderDate.substring(0, 4)

              if (type === 'Future')
              {
                var month_plus_n = current_month + timecounter

                if (month_plus_n > 12)
                {
                  month_plus_n = month_plus_n - 12
                  var year = Number(year_txt) + 1
                  year_txt = String(year)
                }
              } else {
                var month_plus_n = current_month - timecounter

                 if (month_plus_n <= 0)
                {
                  month_plus_n = month_plus_n + 12
                  var year = Number(year_txt) - 1
                  year_txt = String(year)
                }           
              }

              let month_plus_n_txt = String(month_plus_n)
              if (month_plus_n_txt.length === 1) {month_plus_n_txt = '0' + month_plus_n_txt}

              var newdDate = year_txt + '-' + month_plus_n_txt + '-' + cOrderDate.substring(8, 10)

              var cDiff = '-'
              var cPercentage = '-' 
              var new_value = '-'
              var cPercentageNumber = 0

              // Get the description & formattedValue from the measures (@MeasureDimension)
              var { rawValue, formattedValue, description } = dp2['@MeasureDimension']          

              // Search for dates with array (dataArray) and get the future (or past) value and calculate the difference and percentage
              for (var index=0; index<dataArray.length; index++) {
                if (dataArray[index].includes(newdDate)) {
                  let position = index
                  new_value = dataArray[index].substring(11, 30)        // NOTE EXAMPLE: 2018-01-01/1577605.34

                  var cDiffNumber = Number(new_value) - Number(rawValue)
                  cDiffNumber = cDiffNumber.toFixed(2)                // only 2x decimal places

                  cPercentageNumber = 100 - ((Number(rawValue) * 100) / Number(new_value))
                  cPercentageNumber = (cPercentageNumber.toFixed(1)) * -1
                  cPercentage = String(cPercentageNumber) + '%'

                  cDiffNumber = cDiffNumber * -1
                  cDiff = toCommas(cDiffNumber)                       // from number = 1234567890.12  to  1,234,567,890.12
                  new_value = toCommas(new_value) 

                  // Break and stop the for loop cycle
                  break
                }
              }

              //console.log('O:'+cOrderDate)
              //console.log('N:'+newdDate)

              cValueGM = formattedValue
          } else if (timerange === 'Days')
          {
              var newdDate = cOrderDate
              let counterofDates = 0
              let foundtheDate = false
              
              var cDiff = '-'
              var cPercentage = '-' 
              var new_value = '-'
              var indexdate = 0
	      var cPercentageNumber = 0

              // Get the description & formattedValue from the measures (@MeasureDimension)
              var { rawValue, formattedValue, description } = dp2['@MeasureDimension']
              
              cValueGM = formattedValue
              
              // Search for the each current date in array (dataArray) to get the postion to start the coun to days in the next loop
              for (index=0; index<dataArray.length; index++) {
                if (dataArray[index].includes(newdDate)) {
                    foundtheDate = true
                    indexdate = index
                }
                
                if (type === 'Future')
                {
                    if (foundtheDate && dataArray[index].includes(newdDate) === false)
                    {
                      counterofDates = counterofDates + 1

                      if (counterofDates === timecounter)
                          {
                              newdDate  = dataArray[index].substring(0, 10)      // NOTE EXAMPLE: 2018-01-01/1577605.34
                              new_value = dataArray[index].substring(11, 30)

                              var cDiffNumber = Number(new_value) - Number(rawValue)
                              cDiffNumber = cDiffNumber.toFixed(2)                  // only 2x decimal places

                              cPercentageNumber = 100 - ((Number(rawValue) * 100) / Number(new_value))
                              cPercentageNumber = (cPercentageNumber.toFixed(1)) * -1
                              cPercentage = String(cPercentageNumber) + '%'

                              cDiffNumber = cDiffNumber * -1
                              cDiff = toCommas(cDiffNumber)                         // from number = 1234567890.12  to  1,234,567,890.12
                              new_value = toCommas(new_value)                           
                              // Break and stop the for loop cycle
                              break                        
                          }
                    }
                } else if (foundtheDate)
                    {
                      // Break and stop the for loop cycle
                      break                           
                    }
                
              } // for (index=0; index<dataArray.length; index++) 
                 
              if (type === 'Past' && indexdate !== 0)
                {
                    let dif = (indexdate - timecounter) //+ 1
                    if (dif >= 0) {
                      newdDate  = dataArray[dif].substring(0, 10)      // NOTE EXAMPLE: 2018-01-01/1577605.34
                      new_value = dataArray[dif].substring(11, 30)

                      var cDiffNumber = Number(new_value) - Number(rawValue)
                      cDiffNumber = cDiffNumber.toFixed(2)                  // only 2x decimal places

                      cPercentageNumber = 100 - ((Number(rawValue) * 100) / Number(new_value))
                      cPercentageNumber = (cPercentageNumber.toFixed(1)) * -1
                      cPercentage = String(cPercentageNumber) + '%'

                      cDiffNumber = cDiffNumber * -1
                      cDiff = toCommas(cDiffNumber)                         // from number = 1234567890.12  to  1,234,567,890.12
                      new_value = toCommas(new_value)                        
                    }
                    
                } //  if (type === 'Past' && indexdate !== 0)
          } // else if (timerange === 'Days')

          // Increment the cells counter (based on the number of neasures)
          counterCells = counterCells + 1
     
          // Reset the counter for each row
          if (counterCells>1) 
          {
            if (sorting !== 'Yes')
            {
                  // Write into table all dimensions & measures at once (one go only)
                  table_output += '<td><font style="font-size:12px;">'+ cOrderDate +'</font></td>'
                  table_output += '<td><font style="font-size:12px;">'+ cValueGM +'</font></td>'
                  table_output += '<td><font style="font-size:12px;">'+ newdDate +'</font></td>'
                  table_output += '<td><font style="font-size:12px;">'+ new_value +'</font></td>'
                  table_output += '<td><font style="font-size:12px;">'+ cDiff +'</font></td>'

                  if (cPercentageNumber>0)
                  {
                    table_output += '<td><span style="font-size:16px; color:green; font-weight:bold">▲</span><span style="font-size:12px;">'+ cPercentage +'</span></td>'
                  } else {
			if (cPercentage!=='-')
			{
			    table_output += '<td><span style="font-size:16px; color:red; font-weight:bold">▼</span><span style="font-size:12px;">'+ cPercentage +'</span></td>'
			} else {
			    table_output += '<td><span style="font-size:12px;">'+ cPercentage +'</span></td>'
			}
                  }
                    
                  // Close each row
                  table_output += '</tr>'		    
            } else {
              
		let myNumber = String(cPercentageNumber)

		let negative = false;
		if (myNumber.indexOf('-') !== -1)
		{
		  negative = true;
		  myNumber = myNumber.substring(myNumber.indexOf('-')+1,100).trim()
		}
		if (myNumber.indexOf('.') !== -1)
		{
		  var remain = myNumber.substring(myNumber.indexOf('.')+1, 100)
		  var component = myNumber.substring(0, myNumber.indexOf('.'))
		} else {
		  component = myNumber
		  remain = ''
		}

		if (component.length<=4) { component = "0".repeat(4-component.length) + component }
		if (myNumber.indexOf('.') !== -1) { component = component + '.' + remain }
		if (negative) { component = '-' + component }     
		
                let sortText = component + '/' + cOrderDate + '/' + cValueGM + '/' + newdDate + '/' + new_value + '/' + cDiff
                dataArraySort.push(sortText)
            }

            // Moved into a different country and
            // Reset the counter, to start a new row
            counterCells = 1
          }
        
      }) // END of loop --> resultSet.forEach(dp => {
      
  	if (sorting === 'Yes')
	{
		// release from memory un-necessary array
		dataArray = []
		
		// SORT the array dataArraySort
		dataArraySort.sort()
		
		console.log('dataArraySort (SORTED):')
		console.log(dataArraySort)
		
		for (var index=(dataArraySort.length-1); index>=0; index--) {
			let sortText = dataArraySort[index]
			let controlComponents = 1
			
			while(sortText.indexOf("/") !== -1)
			{
				let component = sortText.substring(0, sortText.indexOf("/"))
				
				if (controlComponents===1) {
					var cPercentageNumber = Number(component)
					var cPercentage = String(cPercentageNumber) + '%'
				}
				else if (controlComponents===2) {var cOrderDate = component}
				else if (controlComponents===3) {var cValueGM = component}
				else if (controlComponents===4) {var newdDate = component}
				else if (controlComponents===5) {var new_value = component}
								
				controlComponents = controlComponents + 1
				
				if (sortText.indexOf("/") !== -1){
					sortText = sortText.substring(sortText.indexOf("/")+1, 100).trim()
				}
				
				if (controlComponents===6) {var cDiff = sortText}
			}
			
			// Write into table all dimensions & measures at once (one go only)
			table_output += '<td><font style="font-size:12px;">'+ cOrderDate +'</font></td>'
			table_output += '<td><font style="font-size:12px;">'+ cValueGM +'</font></td>'
			table_output += '<td><font style="font-size:12px;">'+ newdDate +'</font></td>'
			table_output += '<td><font style="font-size:12px;">'+ new_value +'</font></td>'
			table_output += '<td><font style="font-size:12px;">'+ cDiff +'</font></td>'

			if (cPercentageNumber>0)
			{
				table_output += '<td><span style="font-size:16px; color:green; font-weight:bold">▲</span><span style="font-size:12px;">'+ cPercentage +'</span></td>'
			} else if (new_value!=='-')
				{
					table_output += '<td><span style="font-size:16px; color:red; font-weight:bold">▼</span><span style="font-size:12px;">'+ cPercentage +'</span></td>'
				} else {
					table_output += '<td><span style="font-size:12px;">-</span></td>'
				}
			}

			// Close each row
			table_output += '</tr>'	
			
		}
	}
    
      //Close all used tags
      table_output += '</tbody></table></div></div>'
    
      // replace above element "my_data" with the HTML table output (final HTML table built above)
      this._shadowRoot.getElementById('my_data').innerHTML = table_output
      
      // to avoid memory issues, release from memory the huge HTML string (table_output) and the necessary array: dataArray
      table_output = ''
      dataArray = []
      dataArraySort = []
	    
     console.log('----------------')
      
    } // END of method --> render
    
  } // END of class myNewTable
  
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // Return the end result to SAC (SAP ANALYTICS CLOUD) application vvvvvvvvvvvvvvvvvvvvv
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  customElements.define('com-sap-sample-flextablec', FlexTableC_V16)
  
})() // END of function --> (function () {
