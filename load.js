var today = new Date()

var year = today.getFullYear().toString()
var month = today.getMonth()
var month_dict = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var date = today.getDate().toString()
var hour = String(today.getHours() % 12).padStart(2, '0')
var minute = String(today.getMinutes()).padStart(2, '0')
var second = String(today.getSeconds()).padStart(2, '0')
var ampm = ['AM', 'PM'][~~(today.getHours() / 12)]

if (date == '1' || date == '21' || date == '31') {
	date = date + 'st'.sup()
} else if (date == '2' || date == '22') {
	date = date + 'nd'.sup()
} else if (date == '3' || date == '23') {
	date = date + 'rd'.sup()
} else {
	date = date + 'th'.sup()
}

const text1 = 'Retrieval from '
const text2 = '<a href="https://data.gov.sg/dataset/psi?view_id=496c77eb-6add-4e9b-9883-17864cedfe9f&amp;resource_id=82776919-0de1-4faf-bd9e-9c997f9a729d">data.gov.sg</a>'
const text3 = ' at '
const text4 = hour + ':' + minute + ':' + second + ' ' + ampm +', ' + date + ' ' + month_dict[month-1] + ' ' + year
retrieval.innerHTML = text1 + text2 + text3 + text4

var myData
fetch('https://api.data.gov.sg/v1/environment/psi')
	.then(response => response.json())
	.then(data => myData = data)
	.then(() => this.myFunction(myData))

const unit1 = '--'
const unit2 = 'µg/m' + '3'.sup()
var item_dict = {
	'co_sub_index': ['Carbon Monoxide (CO) Sub-index', unit1],
	'o3_sub_index': ['Ozone (O<sub>3</sub>) Sub-index', unit1],
	'so2_sub_index': ['Sulphur Dioxide (SO<sub>2</sub>) Sub-index', unit1],
	'pm10_sub_index': ['PM<sub>10</sub> Sub-index', unit1],
	'pm25_sub_index': ['PM<sub>25</sub> Sub-index', unit1],
	'no2_one_hour_max': ['1-hr Max Nitrogen Dioxide (NO<sub>2</sub>)', unit2],
	'co_eight_hour_max': ['8-hr Max Carbon Monoxide (CO)', unit2],
	'o3_eight_hour_max': ['8-hr Max Ozone (O<sub>3</sub>)', unit2],
	'so2_twenty_four_hourly': ['24-hr Sulphur Dioxide (SO<sub>2</sub>)', unit2],
	'pm10_twenty_four_hourly': ['24-hr PM<sub>10</sub>', unit2],
	'pm25_twenty_four_hourly': ['24-hr PM<sub>25</sub>', unit2],
	'psi_twenty_four_hourly': ['24-hr PSI', unit1],
}

function get_psi_color(psi) {
	if (psi <= 50) {
		font_color = '#FFFFFF'
		background_color = '#419313'
	} else if (psi <=100) {
		font_color = '#FFFFFF'
		background_color = '#21679A'
	} else if (psi <= 200) {
		font_color = '#000000'
		background_color = '#FFD100'
	} else if (psi <= 300) {
		font_color = '#000000'
		background_color = '#FFA800'
	} else {
		font_color = '#FFFFFF'
		background_color = '#D60000'
	}
	return [font_color, background_color]
}

function myFunction(data) {
	var readings = data.items[0].readings
	var keys = Object.keys(item_dict)
	
	var table = document.getElementById('table')
	
	const areas = ['national', 'north', 'south', 'east', 'west', 'central']
	rowhead = table.insertRow()
	
	cell = rowhead.insertCell()
	cell.innerHTML = '<b>Item</b>'
	cell.style = 'width:200px'
	
	cell = rowhead.insertCell()
	cell.innerHTML = '<b>Description</b>'
	cell.style = 'width:280px'
	
	cell = rowhead.insertCell()
	cell.innerHTML = '<b>Unit</b>'
	cell.style = 'width:80px'
	
	for (i = 0; i < 6; i++) {
		header = areas[i]
		header = header.charAt(0).toUpperCase() + header.slice(1)
		rowhead.insertCell().innerHTML = '<b>' + header + '</b>'
	}
	
	for (i = 0; i < 12; i++) {
		row = table.insertRow()
		row.insertCell().innerHTML = keys[i]
		row.insertCell().innerHTML = item_dict[keys[i]][0]
		row.insertCell().innerHTML = item_dict[keys[i]][1].slice(1);
		
		for (j = 0; j < 6; j++) {
			value = readings[keys[i]][areas[j]]
			
			cell = row.insertCell()
			cell.innerHTML = value.toString()
			if (keys[i] == 'psi_twenty_four_hourly') {
				colors = get_psi_color(value)
				cell.innerHTML = '<p style="color:' + colors[0] + ';margin:0"><b>' + value.toString() + '</b></p>'
				cell.style = 'background-color:' + colors[1]
			}
		}
	}
}