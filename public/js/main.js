setInterval(()=>{
	//get data and parse json, passing it to the view
	$.get('/arduinodata', (data)=>{
		let dats = JSON.parse(data)
		$('.temps').text(dats[0].temp)
		$('.humds').text(dats[0].humid)
		$('.sun').text(dats[0].sun)
		$('.lgt').text(dats[0].hif)
		if(dats[0].temp > 75.0 || dats[0].sun > 850 || dats[0].temp < 62.0 ){
			alert_user(dats[0].temp, dats[0].humid, dats[0].sun)
		}
  	})
}, 5202)

//alert user function 
function alert_user(temp, humid, light){
	//get date and time
	let time = dateTime()
	//ajax post request to the backend when the sensor data is above requirements
	$.ajax({
		url: "/emailwarn",
		method: "POST",
		data: {message: `Temp: ${temp}, Humidity: ${humid}, Light: ${light}. The site you have chosen does not meet your requirements at ${time}. ` },
		dataType: "json"
	})
}/*end of alert_user*/

//get the current date and time
function dateTime(){
	const dayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	const date = new Date()
	let hour = date.getHours()
	let min = date.getMinutes()
	let sec = date.getSeconds()
	let mode = "AM";
	if(hour == 12){
		mode = "PM"
	} else if (hour > 12){
		hour = hour - 12
		mode = "PM"
	}
	return `${dayList[date.getDay() + 1]}, ${hour}:${min}:${sec} ${mode}`

}/*end of dateTime*/