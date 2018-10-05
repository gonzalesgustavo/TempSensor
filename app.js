const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const SerialPort = require('serialport')
const email = require('emailjs')

const app = express()

const arduinoPort = 'yourport'
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


const Readline = SerialPort.parsers.Readline
const ports = new SerialPort(arduinoPort, {
  baudRate: baudRate
})

const parser = new Readline()
ports.pipe(parser)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
	res.render('index', {
		title: 'Plant Safe ?'
	})
})

app.get('/arduinodata', (req, res, next)=>{
	parser.on('data', (data)=>{
		res.end(data)
	})
})

app.post('/emailwarn', (req, res, next)=>{
		server.send({
		   text:    req.body.message, 
		   from:    from, 
		   to:      to,
		   subject: "Plant Safe ? Warning"
		}, function(err, message) { console.log(err || message); });
})

app.listen(3000, ()=>{
	console.log("Server started on port 3000")
})