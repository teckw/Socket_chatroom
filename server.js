var express = require('express');
var path = require('path');
var session = require('express-session');
var app = express();
app.use(express.static(path.join(__dirname, "./static")));
// app.use(session({secret: "secrety"}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render("index");
});

// app.post('/users', function(req, res){
// 	req.session.name = req.body.name;
// 	console.log(req.session.name);
// 	res.redirect('/');
// })

var server = app.listen(8000, function(){
	console.log("magical things are happening on port 8000");
});

var io = require('socket.io').listen(server);

var message_history = [];
var users = [];

io.sockets.on('connection', function(socket){
	socket.on("got_new_user", function(data){
		// var user_id = socket.id;
		users.push({name: data.name, id: socket.id});
		io.emit("new_user", {response: data, history: message_history});
		console.log(data);
	});

	socket.on("message", function(data){
		io.emit("all_messages", {response: data});
		message_history.push(data);
		console.log(data);
	});

	socket.on("disconnect", function(){
		for (user in users){
			if (socket.id == users[user].id){
				io.emit("user_left", {response: users[user].name});
			}
		}
		console.log("disconnected");
	})


})



