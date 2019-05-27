const express = require('express');
//const Schema = require('./models/Schema');
// var multer = require('multer')
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressStatusMonitor = require('express-status-monitor');
const path = require('path');
var session = require("express-session"),
LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var events = require('events')
var _ = require('lodash')
var eventEmitter = new events.EventEmitter()

// app.use(session({secret:'xxccvvbb'}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.set('port', process.env.PORT || 3000);
app.use(flash());
app.use(express.static(path.join(__dirname, 'statics')));
// app.use(multer({ dest: "./uploads/", rename: function (fieldname, filename) { return filename;}}));
// var upload = multer({dest:'./uploads/'})

//Passport js config
app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
});


passport.use(new LocalStrategy( {passReqToCallback : true} ,
	function(req, username , password , done) {
		var User = mongoose.model('User' , Schema.User , 'User')
		User.findOne({username : username} , function(err , entity) {
			//validate user
			//hash = bcrypt.hashSync(password)
			if (bcrypt.compareSync(password , entity.password)) {
				req.session.field = req.body.flag
				req.session.username = username
				console.log(username)
				if(req.body.flag == "org") {
					var NGO = mongoose.model('Ngo' , Schema.Ngo , 'Ngo')
					NGO.findOne({"ngodarpanid" : username} , function(err , ngo) {
						if(err) {
                                			return done(err)
                        			}
                        			if(!ngo) {
                                			return done(null, false, { message: 'Incorrect username.' });
                        			}
                        			return done(null , ngo)
					})
				}

				if(req.body.flag == "per") {
					var Person = mongoose.model('Person' , Schema.Person , 'Person')
					Person.findOne({"username" : username} , function (err , person) {
						if(err) {
                        	        		return done(err)
                        			}
                        			if(!person) {
                        	        		return done(null, false, { message: 'Incorrect username.' });
                        			}
                        			return done(null , person)
					})
				}

				if(req.body.flag == "admin") {
					console.log("admin")
					req.session.username = username
					var Admin = mongoose.model('Admin' , Schema.Admin , 'Admin')
					Admin.findOne({"adminid" : username} , function (err , person) {
						if(err) {
            	return done(err)
            }
            if(!person) {
            	return done(null, false, { message: 'Incorrect username.' });
            }
            return done(null , person)
					})
				}

				//company here
				if(req.body.flag == "com") {
				}

			} else {
				return done(null, false, { message: 'Incorrect password.' });
			}
		})
	}));



//The Routes
	//General
app.get('/' , function (req, res) {
  res.render('homepage')
});
app.get('/test' , function(req, res) {
		res.render('test');
});
	//Auth
/*
app.get('/signup_person' , authC.getSignupPerson);
app.post('/signup_person', authC.postSignupPerson);
app.get('/signup_company' , authC.getSignupCom);
app.post('/signup_company', authC.postSignupCom);
app.get('/signup_org' , authC.getSignupOrg);
app.post('/signup_org', authC.postSignupOrg);
*/
app.get("/login" , function(req, res){
  res.render("login")
})

app.get("/admin" , function(req, res){
  res.render("admin")
})


/*app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});*/

app.post('/login',
 	passport.authenticate('local', { successRedirect: '/feed',
		failureRedirect: '/login',
		failureFlash: true })
);
io.on('connection', function(socket){
  console.log("Connection made. Hurray!")
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
	console.log(msg);
  });
});

app.post('/admin',
 	passport.authenticate('local', { successRedirect: '/adminfeed',
		failureRedirect: '/login',
		failureFlash: true })
);
io.on('connection', function(socket){
  console.log("Connection made. Hurray!")
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
	console.log(msg);
  });
});


// app.get('/logout' , authC.getLogout);

//Start Express server.
http.listen(app.get('port'), () => {
	console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
	console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
var sockets = {};
var userStack = {};
var oldChats, sendUserStack, setRoom;
var userSocket = {};
ioChat = io;

ioChat.on('connection', function(socket) {
    console.log("socketio chat connected.");

    //function to get user name
    socket.on('set-user-data', function(username) {
      console.log(username+ "  logged In");



      //storing variable.
      socket.username = username;
      userSocket[socket.username] = socket.id;

      socket.broadcast.emit('broadcast',{ description: username + ' Logged In'});

	  console.log(userSocket);


      //getting all users list
      eventEmitter.emit('get-all-users');

      //sending all users list. and setting if online or offline.
      sendUserStack = function() {
        for (i in userSocket) {
          for (j in userStack) {
            if (j == i) {
              userStack[j] = "Online";
            }
          }
        }
        //for popping connection message.
        ioChat.emit('onlineStack', userStack);
      } //end of sendUserStack function.

    }); //end of set-user-data event.

    //setting room.
    socket.on('set-room', function(room) {
      //leaving room.
      socket.leave(socket.room);
      //getting room data.
    //   eventEmitter.emit('get-room-data', room);
	roomModel.find({
	  $or: [{
		name1: room.name1
	  }, {
		name1: room.name2
	  }, {
		name2: room.name1
	  }, {
		name2: room.name2
	  }]
	}, function(err, result) {
	  if (err) {
		console.log("Error : " + err);
	  } else {
		if (result == "" || result == undefined || result == null) {

		  var today = Date.now();

		  newRoom = new roomModel({
			name1: room.name1,
			name2: room.name2,
			lastActive: today,
			createdOn: today
		  });

		  newRoom.save(function(err, newResult) {

			if (err) {
			  console.log("Error : " + err);
			} else if (newResult == "" || newResult == undefined || newResult == null) {
			  console.log("Some Error Occured During Room Creation.");
			} else {
			console.log("Random else 1");
			  setRoom(newResult._id); //calling setRoom function.
			}
		  }); //end of saving room.

		} else {
		  console.log("Random else 2");
		  var jresult = JSON.parse(JSON.stringify(result));
		  setRoom(jresult[0]._id); //calling setRoom function.
		}
	  } //end of else.
	});
      //setting room and join.
      console.log(room);
      setRoom = function(roomId) {
        socket.room = roomId;
        console.log("roomId : " + socket.room);
        socket.join(socket.room);
        ioChat.to(userSocket[socket.username]).emit('set-room', socket.room);
      };

    }); //end of set-room event.

    //emits event to read old-chats-init from database.
    socket.on('old-chats-init', function(data) {
      eventEmitter.emit('read-chat', data);
    });

    //emits event to read old chats from database.
    socket.on('old-chats', function(data) {
		chatModel.find({})
          .where('room').equals(data.room)
          .sort('-createdOn')
          .skip(data.msgCount)
          .lean()
          .exec(function(err, result) {
            if (err) {
              console.log("Error : " + err);
            } else {
              //calling function which emits event to client to show chats.
    		  ioChat.to(data.room).emit('chats', {
    			result: result,
    			room: data.room
    		  });
            }
        });
    });

    //sending old chats to client.
    oldChats = function(result, username, room) {
      ioChat.to(room).emit('old-chats', {
        result: result,
        room: room
      });
    }

    //showing msg on typing.
    socket.on('typing', function() {
      socket.to(socket.room).broadcast.emit('typing', socket.username + " : is typing...");
    });

    //for showing chats.
    socket.on('chat-msg', function(data) {
	  console.log(socket.username, data);
      //emits event to save chat to database.
	  console.log(data);
      var newChat = new chatModel({

        msgFrom: socket.username,
        msgTo: data.msgTo,
        msg: data.msg,
        room: socket.room,
        createdOn: data.date

      });

      newChat.save(function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else if (result == undefined || result == null || result == "") {
          console.log("Chat Is Not Saved.");
        } else {
          console.log("Chat Saved.");
          //console.log(result);
        }
      });
      //emits event to send chat msg to all clients.
	  ioChat.to(socket.room).emit('chat-msg', {
        msgFrom: socket.username,
        msg: data.msg,
        date: data.date
      });
    });

    //for popping disconnection message.
    socket.on('disconnect', function() {

      console.log(socket.username+ "  logged out");
      socket.broadcast.emit('broadcast',{ description: socket.username + ' Logged out'});



      console.log("chat disconnected.");

      _.unset(userSocket, socket.username);
      userStack[socket.username] = "Offline";

      ioChat.emit('onlineStack', userStack);
    }); //end of disconnect event.

  //listening for get-all-users event. creating list of all users.
  eventEmitter.on('get-all-users', function() {
    userModel.find({})
      .select('username')
      .exec(function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          //console.log(result);
          for (var i = 0; i < result.length; i++) {
            userStack[result[i].username] = "Offline";
          }
          //console.log("stack "+Object.keys(userStack));
          sendUserStack();
        }
      });
  }); //end of get-all-users event.

  //listening get-room-data event.
  eventEmitter.on('get-room-data', function(room) {
    roomModel.find({
      $or: [{
        name1: room.name1
      }, {
        name1: room.name2
      }, {
        name2: room.name1
      }, {
        name2: room.name2
      }]
    }, function(err, result) {
      if (err) {
        console.log("Error : " + err);
      } else {
        if (result == "" || result == undefined || result == null) {

          var today = Date.now();

          newRoom = new roomModel({
            name1: room.name1,
            name2: room.name2,
            lastActive: today,
            createdOn: today
          });

          newRoom.save(function(err, newResult) {

            if (err) {
              console.log("Error : " + err);
            } else if (newResult == "" || newResult == undefined || newResult == null) {
              console.log("Some Error Occured During Room Creation.");
            } else {
			  console.log("Random else 1");
              setRoom(newResult._id); //calling setRoom function.
            }
          }); //end of saving room.

        } else {
          console.log("Random else 2");
          var jresult = JSON.parse(JSON.stringify(result));
          setRoom(jresult[0]._id); //calling setRoom function.
        }
      } //end of else.
    }); //end of find room.
  });

  }); //end of io.on(connection).
