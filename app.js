const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const client = require('twilio')('ACd86ef1ae1c5f242dd8818767e6d8a5b9', 'f30c79e6a089ccdea17425dfabedaa7c');
const app = express();

const User = require("./models/user");
const Blog = require("./models/blog");
//db
mongoose.connect('mongodb+srv://nehagoyal:nehagoyal@cluster0.vqfk9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//app setup
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json())
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//auth config
app.use(session({
	secret:"HackViolet",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})


app.get("/register", function(req,res){
	res.render("register");
})
app.post("/register",(req,res) => {
	  
	let newUser = new User({username:req.body.username, email:req.body.email, date:0000-00-00});
    // console.log(req.body)
	User.register(newUser, req.body.password, (err,user) => {
		if(err){
			console.log(err);
			return res.redirect("back")
		}
		passport.authenticate("local")(req,res,() => {
			res.redirect("/");
		})
	})
})

//LOGIN ROUTES
app.get("/login",(req,res) => {
	
	res.render("login")
});
app.post("/login",passport.authenticate("local",{
		failureRedirect:"/"
	}),(req,res) => {
	res.redirect("/");
});

//LOGOUT ROUTES
app.get("/logout",(req,res) => {
	req.logout();
	res.redirect("/");
})
app.get("/music", (req, res)=>{
	res.render("music");
})
app.get("/exercise", (req, res)=>{
	res.render("exercise");
})
app.put("/update", (req, res)=>{
	var updated = {date:req.body.date}
	if(req.user){
		User.findByIdAndUpdate(req.user._id, updated,  (err, user)=>{
			if(err){
				console.log(err);
			}else{
				// user.date = req.body.date;
				console.log("done");
			}
		})
	}
})
app.get("/exercisemiddle", (req, res)=>{
	res.render("exercisemiddle");
})
//routes
app.get("/",function(req,res){
	function sendMessage(){
		client.messages.create({
			body: 'It is that time of the month again, ugh! But we have got your back. A reminder for you to get your stock of pads and tampons refilled!',
			to: '+918146896462',
			from: '+18508015890'
		 }).then(message => console.log(message))
		   // here you can implement your fallback code
		   .catch(error => console.log(error))
	}
	var today = new Date();
	let flag = 1;
	
	if(req.user && req.user.date.getTime()!=0){
		var today = new Date();
	// 	console.log(req.user);
	// console.log(Math.abs(req.user.date.getDate()-today.getDate()));
		if(Math.abs(req.user.date.getDate()- today.getDate()) <= 4){
			flag = 2;
			sendMessage();
			console.log("Sent");
		}else{
			flag = 0;
		}
	}else if(!req.user){
		flag = -1;
	}
	res.render("home", {flag:flag});
})

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Now serving the HackViolet app.");
})