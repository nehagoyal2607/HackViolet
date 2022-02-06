const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const expressSanitizer = require("express-sanitizer");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");

const app = express();

const User = require("./models/user");
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
app.get("/exercisemiddle", (req, res)=>{
	res.render("exercisemiddle");
})
//routes
app.get("/",function(req,res){
	// console.log(req.user.date);
	res.render("home");
})

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Now serving the HackViolet app.");
})