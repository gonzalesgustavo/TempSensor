//required statments
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const SerialPort = require('serialport')
const email = require('emailjs')

//select web port
const webPort =  3000

//initialize express
const app = express()

//arduino setup (set port for the arduino you have)
const arduinoPort = 'yourport'
//set the baud rate
const baudRate = 9600

//sent email settings
const from = ''
const to = ''

//email js settings (this is the email from which you are sending the email from)
const userName = 'email'
const password = 'password'
const host = "smtp.gmail.com"

const server = email.server.connect({
   user:    userName, 
   password: password, 
   host:   host , 
   ssl:     true
})

//setup for Serial port to parse the information comming in
const Readline = SerialPort.parsers.Readline
const ports = new SerialPort(arduinoPort, {
  baudRate: baudRate
})
//read lines from the serial port
const parser = new Readline()
ports.pipe(parser)

//setup view and template should it be needed
app.set('view engine', 'ejs')
//setup folder views to handle views
app.set('views', path.join(__dirname, 'views'))
//setup body poarser to handle form submission
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
//setup the public folder
app.use(express.static(path.join(__dirname, 'public')))

//home route
app.get('/', (req, res)=>{
	res.render('index', {
		title: 'Plant Safe ?'
	})
})
//get sensore data via post
app.get('/arduinodata', (req, res, next)=>{
	parser.on('data', (data)=>{
		res.end(data)
	})
})
//email when temperature or light is too high
app.post('/emailwarn', (req, res, next)=>{
	//use send mail to notify me
		server.send({
		   text:    req.body.message, 
		   from:    from, 
		   to:      to,
		   subject: "Plant Safe ? Warning"
		}, function(err, message) { console.log(err || message); });
})

app.listen(webPort, ()=>{
	console.log("Server started on port 3000")
})