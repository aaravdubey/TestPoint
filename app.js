const express = require('express');
var session = require('express-session');
var Cookies = require('cookies')
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
var crypto = require('crypto');
var uuid = require('node-uuid');

app.use(session({
    secret: "secret",
    genid: function (req) {
        return crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
    },
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-aarav:testpoint@cluster0.3hbsmke.mongodb.net/testpoint", { useNewUrlParser: true });

const testSchema = mongoose.Schema({
    questions: String,
    org_name: String,
    org_email: String,
    test_name: String,
    test_desc: String,
    test_inst: String,
    tech_name: Array
});
const Test = mongoose.model("test", testSchema);

const userSchema = mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    contact: { type: Number },
    password: String,
    city: String, 
    education: String,
    experience: String
})
const User = mongoose.model("user", userSchema);

const orgSchema = mongoose.Schema({
    orgname: String,
    orgemail: { type: String, unique: true },
    orgcontact: { type: Number },
    orgpassword: String
})
const Org = mongoose.model("org", orgSchema);

app.get("/", (req, res) => {
    Test.find({ org_email: req.session.orgemail }, 'test_name test_desc tech_name', (err, testInfos) => {
        if (err) {
            console.log(err);
        }
        else {
            // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
            // var email = cookies.get('email', { signed: true });
            // console.log(req.session.id);
            if (req.session.validLoginOrg != null) {
                res.render('orgmain', { tinfo: testInfos, email: req.session.orgemail });
            }
            else {
                res.redirect("/orglogin");
            }
            // console.log(testInfos.length);
        }
    });


    // res.sendFile(__dirname+"/x.html");
})
app.get("/main", (req, res) => {
    User.findOne({email: req.session.email}, (err, userdata)=>{
        console.log(req.session.email);
        if (err) {
            console.log(err);
        }
        else {
            Test.find({}, 'test_name test_desc tech_name org_name', (err, testInfos) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
                    // var email = cookies.get('email', { signed: true });
                    if (req.session.validLogin != null) {
                        res.render('main', { tinfo: testInfos, email: req.session.email, user: userdata });
                    }
                    else {
                        res.redirect("/login");
                    }
                    // res.render('main', {tinfo: testInfos, email: req.query.email});
        
                    // console.log(testInfos.length);
                }
            });
        }
    })
    
})

app.post("/main", (req, res)=>{
    console.log(req.body);
    User.updateOne({email: req.session.email}, {'username': req.body.username, 'contact': req.body.contact, 'city': req.body.cityname, 'education': req.body.education, 'experience': req.body.experience}, {upsert: true}, (err)=>{
        if (err){
            console.log(err);
        }else{
            res.redirect("/main");
        }
    })
})



app.listen(3000, () => {
    console.log("server started");
})

app.get("/test", (req, res) => {
    res.render('test', { email: req.session.orgemail });
})

app.post("/test", (req, res) => {
    if (req.session.validLoginOrg != null) {
        let q = [];
    let len = Object.keys(req.body).length;
    for (i = 0; i < (len - 3); i++) {
        q.push(req.body[i]);
    }
    console.log(q);

    Org.findOne({orgemail: req.session.orgemail},'orgname',(err, o_name)=>{
        if (err) {
            console.log(err);
        }
        else {
            // console.log(req.session.orgemail);
            // console.log(o_name);
            // console.log(o_name.orgname);

            const newTest = new Test({
                questions: JSON.stringify(q),
                org_email: req.session.orgemail,
                org_name: o_name.orgname,
                test_name: req.body.testname,
                test_desc: req.body.description,
                test_inst: req.body.instructions,
                tech_name: req.body.techName
            });
            newTest.save();
            res.redirect("/");
        }

    })
    }
    else {
        res.redirect("/orglogin");
    }
})


app.get("/login", (req, res) => {
    res.render("login", { displayError: "hidden" });
})
app.get("/orglogin", (req, res) => {
    res.render("orglogin", { displayError: "hidden" });
})
app.get("/orgregister", (req, res) => {
    res.render("orgregister", { displayError: "hidden" });
})

app.post("/login", (req, res) => {
    if (req.body.button == "register") {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            contact: req.body.contact,
            password: req.body.password
        });

        let count;
        User.countDocuments({ email: req.body.email }, (err, c) => {
            if (err) {
                console.log('Error');
            } else {
                if (c == 0) {
                    newUser.save();
                    // var email = encodeURIComponent(req.body.email);
                    // res.redirect("/main?email="+ email);
                    req.session.email = req.body.email;
                    req.session.validLogin = "true";
                    req.session.save();
                    res.redirect("/main");
                } else {
                    res.render("login", { displayError: "visible" });
                }
            }
        });


    }
    if (req.body.button == "login") {

        let count;
        User.countDocuments({ email: req.body.email }, (err, c) => {
            if (err) {
                console.log('Error');
            } else {
                if (c > 0) {
                    console.log("here");
                    User.findOne({ email: req.body.email }, 'password', (err, pass) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(pass);
                            if (pass.password == req.body.password) {
                                // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
                                // cookies.set('email', req.body.email, { signed: true });
                                req.session.email = req.body.email;
                                req.session.validLogin = "true";
                                req.session.save();
                                res.redirect("/main");
                            }

                            // console.log(testInfos.length);
                        }
                    });

                    // var email = encodeURIComponent(req.body.email);
                    // res.redirect("/main?email="+ email);
                    // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
                    // cookies.set('email', req.body.email, { signed: true });
                    // res.redirect("/main");
                } else {
                    res.render("login", { displayError: "visible" });
                }
            }
        });


    }

    console.log(req.body);
})

app.post("/orglogin", (req, res) => {
    if (req.body.button == "orgregister") {
        console.log("in here");
        const newOrg = new Org({
            orgname: req.body.username,
            orgemail: req.body.email,
            orgcontact: req.body.contact,
            orgpassword: req.body.password
        });

        let count;
        Org.countDocuments({ orgemail: req.body.email }, (err, c) => {
            if (err) {
                console.log('Error');
            } else {
                if (c == 0) {
                    newOrg.save();
                    // var email = encodeURIComponent(req.body.email);
                    // res.redirect("/main?email="+ email);
                    req.session.orgemail = req.body.email;
                    req.session.validLoginOrg = "true";
                    req.session.save();
                    // console.log(req.session);
                    res.redirect("/");
                } else {
                    res.render("orglogin", { displayError: "visible" });
                }
            }
        });


    }
    if (req.body.button == "orglogin") {

        let count;
        Org.countDocuments({ orgemail: req.body.email }, (err, c) => {
            if (err) {
                console.log('Error');
            } else {
                if (c > 0) {
                    // console.log("here");
                    Org.findOne({ orgemail: req.body.email }, 'orgpassword', (err, pass) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if (pass.orgpassword == req.body.password) {
                                // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
                                // cookies.set('email', req.body.email, { signed: true });
                                // console.log(req.session.id);

                                req.session.orgemail = req.body.email;
                                req.session.validLoginOrg = "true";
                                req.session.save();
                                console.log(req.session);
                                res.redirect("/");
                            }
                            else {
                                res.send("Wrong Password");
                            }

                            // console.log(testInfos.length);
                        }
                    });

                    // var email = encodeURIComponent(req.body.email);
                    // res.redirect("/main?email="+ email);
                    // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
                    // cookies.set('email', req.body.email, { signed: true });
                    // res.redirect("/main");
                } else {
                    res.render("login", { displayError: "visible" });
                }
            }
        });


    }

    console.log(req.body);
})