require('dotenv').config()
const express = require('express');
var session = require('express-session');
var Cookies = require('cookies')
const bodyParser = require('body-parser');
const app = express();
const gpass = process.env.GMAIL_PASS;
const otpGenerator = require('otp-generator');
const mongoose = require('mongoose');
var crypto = require('crypto');
var uuid = require('node-uuid');
const nocache = require("nocache");
var nodemailer = require('nodemailer');
const { emit } = require('process');


app.use(nocache());

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
    test_duration: Number,
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
    experience: String,
    about: String
})
const User = mongoose.model("user", userSchema);

const orgSchema = mongoose.Schema({
    orgname: String,
    orgemail: { type: String, unique: true },
    orgcontact: { type: Number },
    orgpassword: String,
    orgcity: String,
    orgabout: String
})
const Org = mongoose.model("org", orgSchema);

const resultSchema = mongoose.Schema({
    test_id: String,
    marks: Number,
    totalmarks: Number,
    username: String,
    email: String,
    test_name: String,
    time: String,
    date: String,
    org_email: String
});
const Result = mongoose.model('Result', resultSchema);

const otpSchema = mongoose.Schema({
    email: String,
    otp: String
});
const Otp = mongoose.model('Otp', otpSchema);

app.get('/taketest', async function (req, res) {
    if (req.session.validLogin == null) {
        res.redirect("/login");
    } else if (req.session.testid == null) {
        res.redirect("/main");
    } else {
        await Test.findById({ _id: req.session.testid }, function (err, test) {
            if (err) {
                console.log(err);
            } else {
                let arr = JSON.parse(test.questions);
                // console.log(arr);
                res.render('taketest', {
                    arr: arr,
                    tstname: test.test_name,
                    desc: test.test_desc,
                    inst: test.test_inst,
                    timex: test.test_duration
                });
                // console.log(arr[1][1][0]);
            }
        }).clone().catch(function (err) { console.log(err) })
    }

})
app.post("/redirectToTest", (req, res) => {
    req.session.testid = req.body.testid;
    res.redirect("/taketest");
})

app.post('/taketest', async function (req, res) {
    let marks = 0, totalmarks = 0;
    let org_email = "";
    let test_id = "";
    let test_name = "";
    
    await Test.findById({ _id: req.session.testid }, function (err, test) {
        if (err) {
            console.log(err);
        } else {
            console.log(req.body);
            console.log(test);
            org_email = test.org_email;
            test_id = test.id;
            test_name = test.test_name;
            let arr = JSON.parse(test.questions);
            for (i = 0; i < arr.length - 2; i++) {
                //console.log(req.body[i]);
                totalmarks += parseInt(arr[i][3]);
                if (req.body[i].length == arr[i][2].length) {
                    for (k = 0; k < arr[i][2].length; k++) {
                        if (req.body[i][k] != arr[i][2][k]) {
                            continue;
                        }
                        if (k == arr[i][2].length - 1) {
                            marks += parseInt(arr[i][3]);
                        }
                    }
                } else {
                    //no marks
                }
            }
            let date_ob = new Date();
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let date = year + "/" + month + "/" + day;
            let time = hours + ":" + minutes;
            const result = new Result({
                test_id: test_id,
                marks: marks,
                totalmarks: totalmarks,
                username: req.session.username,
                email: req.session.email,
                org_email: org_email,
                test_name: test_name,
                time: time,
                date: date
            })
            result.save();
            req.session.testid = null;
            res.redirect("/main");
        }
    }).clone().catch(function (err) { console.log(err) })
})

app.get("/lead", async (req, res) => {
    let username = "...";
    if(req.session.orgemail){
        username = req.session.orgemail;
    }else if(req.session.email){
        username = req.session.email;
    }
    await Result.find({ test_id: req.session.testidforleaderb }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('leaderboard1', {
                result: result,
                username: username
            });
            // console.log(arr[1][1][0]);
        }
    }).sort({ 'marks': -1 }).clone().catch(function (err) { console.log(err) })
})

app.post('/leaderboard', async function (req, res) {
    req.session.testidforleaderb = req.body.test_id;
    res.redirect("/lead");
})



app.get('/result', async function (req, res) {
    await Result.find({ email: req.session.email }, function (err, resultpage) {
        if (err) {
            console.log(err);
        } else {
            res.render('result1', {
                resultpage: resultpage,
                username: req.session.username
            });
            // console.log(arr[1][1][0]);
        }
    }).clone().catch(function (err) { console.log(err) })
})


app.get("/", (req, res) => {
    Org.findOne({ orgemail: req.session.orgemail }, (err, orgdata) => {
        console.log(req.session.email);
        if (err) {
            console.log(err);
        } else {
            console.log(orgdata);
            Test.find({ org_email: req.session.orgemail }, 'test_name test_desc tech_name', (err, testInfos) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
                    // var email = cookies.get('email', { signed: true });
                    // console.log(req.session.id);
                    if (req.session.validLoginOrg != null) {
                        res.render('orgmain', { tinfo: testInfos, email: req.session.orgemail, org: orgdata });
                    }
                    else {
                        res.redirect("/orglogin");
                    }
                    // console.log(testInfos.length);
                }
            });
        }
        // res.sendFile(__dirname+"/x.html");
    })
})

app.post("/", (req, res) => {
    console.log(req.body);
    Org.updateOne({ orgemail: req.session.orgemail }, { 'orgname': req.body.orgname, 'orgcontact': req.body.orgcontact, 'orgcity': req.body.orgcityname, 'orgabout': req.body.orgabout }, { upsert: true }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    })
})

app.get("/main", (req, res) => {
    User.findOne({ email: req.session.email }, (err, userdata) => {
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
                    // var option = {
                    //     width: 100,
                    //     text: 'JL',
                    //     color: '#FFFFFF'
                    //   };
                    //   var avatarGenerator = new AvatarGenerator();
                    //   avatarGenerator.generate(option, function (image) {
                        
                    //   });
                    // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
                    // var email = cookies.get('email', { signed: true });
                    if (req.session.validLogin != null) {
                        res.render('main', { tinfo: testInfos, user: userdata });
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

app.post("/main", (req, res) => {
    console.log(req.body);
    User.updateOne({ email: req.session.email }, { 'username': req.body.username, 'contact': req.body.contact, 'city': req.body.cityname, 'education': req.body.education, 'experience': req.body.experience, 'about': req.body.about }, { upsert: true }, (err) => {
        if (err) {
            console.log(err);
        } else {
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

        Org.findOne({ orgemail: req.session.orgemail }, 'orgname', (err, o_name) => {
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
                    test_duration: req.body.duration,
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
    res.render("login", { displayError: "hidden",  errorMssg: ''});
})
app.get("/orglogin", (req, res) => {
    res.render("orglogin", { displayError: "hidden",  errorMssg: '' });
    // if(req.body.button == "orglogin"){
    //     res.render("orglogin", { displayError: "hidden" });
    // } else if (req.body.button == "orgforgot"){
    //     res.render("orgforgotpass");
    // }

})
app.get("/validateEmail", (req, res) => {
    res.render("validateEmail", { displayError: 'hidden', errorMssg: '' });
})
let otp;
app.post("/generateOtp", (req, res) => {

    Otp.exists({email: req.body.email}, function (err, doc) {
        if (err){
            console.log(err)
        }else{
            if (doc != null){
                Otp.deleteMany({email: req.body.email}, (err, res)=>{
                    if (err){
                        console.log(err);
                    }
                })
            }
        }
    });
    // console.log(ifExists + " if Exists");
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'daarav101@gmail.com',
            pass: gpass
        }
    });

    

    const user = User.countDocuments({ email: req.body.email }, (err, user_count) => {
        const org = Org.countDocuments({ orgemail: req.body.email }, (err, org_count) => {
            if (user_count > 0) {
                req.session.emailforpassreset = req.body.email;
                console.log("in usercount" + req.session.emailforpassreset);
                req.session.save();

                let email = req.body.email;
                let otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

                var mailOptions = {
                    from: 'daarav101@gmail.com',
                    to: req.body.email,
                    subject: 'Your One-time Password : ' + otp,
                    text: otp
                };

                const newOtp = new Otp({
                    email: email,
                    otp: otp
                });
                newOtp.save();

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            else if (org_count > 0) {
                req.session.orgemailforpassreset = req.body.email;
                console.log("in orgcount" + req.session.orgemailforpassreset);
                req.session.save();

                let email = req.body.email;
                let otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

                var mailOptions = {
                    from: 'daarav101@gmail.com',
                    to: req.body.email,
                    subject: 'Your One-time Password : ' + otp,
                    text: otp
                };

                const newOtp = new Otp({
                    email: email,
                    otp: otp
                });
                newOtp.save();

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            else {
                console.log("This email is not registered");

            }
        });
    });

})

app.post("/validateEmail", (req, res) => {
    let email;
    // console.log("in validate");
    // console.log(req.body);

    Otp.findOne({ email: req.body.email }, 'otp', (err, otp) => {
        if (err) {
            console.log(err);
        }
        else {
            if (!otp) {
                res.render("validateEmail", { displayError: 'show', errorMssg: 'First generate an OTP for this Email' });
            }
            else if (otp.otp == req.body.otp) {
                req.session.showforgotpass = true;
                // req.session.resetPassEmail = req.body.email;
                Otp.deleteMany({ email: req.body.email }, (err, data) => { console.log(err); })
                res.redirect("/orgforgotpass");
            }
            else {
                res.render("validateEmail", { displayError: 'show', errorMssg: 'Invalid OTP !' });
            }
        }
    });
})

app.get("/orgforgotpass", (req, res) => {
    if (req.session.showforgotpass == true) {
        res.render("orgforgotpass", { displayMod: 'show' });
    } else {
        res.redirect("/validateEmail");
    }
})

app.post("/orgforgotpass", (req, res) => {
    // console.log("org " + req.session.orgemailforpassreset);
    // console.log("user " + req.session.emailforpassreset);
    if (req.session.orgemailforpassreset != null) {
        Org.updateOne({ orgemail: req.session.orgemailforpassreset }, { 'orgpassword': req.body.password }, { upsert: true }, (err) => {
            if (err) {
                console.log(err);
            } else {
                req.session.showforgotpass == null;
                res.redirect("/orglogin");
            }
        })
    } else if (req.session.emailforpassreset != null) {
        User.updateOne({ email: req.session.emailforpassreset }, { 'password': req.body.password }, { upsert: true }, (err) => {
            if (err) {
                console.log(err);
            } else {
                req.session.showforgotpass == null;
                res.redirect("/login");
            }
        })
    }
})

app.get("/orgregister", (req, res) => {
    res.render("orgregister", { displayError: "hidden" });
})
app.get("/logout", (req, res) => {
    if (req.session.validLoginOrg != null) {
        req.session.validLoginOrg = null;
        req.session.orgemail = null;
        res.redirect("/orglogin");
    } else {
        req.session.validLogin = null;
        req.session.username = null;
        req.session.email = null;
        res.redirect("/login");
    }
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
                console.log(err);
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
                    res.render("login", { displayError: "visible", errorMssg: "This email is already registered. Please Sign In." });
                }
            }
        });


    }
    if (req.body.button == "login") {

        let count;
        User.countDocuments({ email: req.body.email }, (err, c) => {
            if (err) {
                console.log(err);
            } else {
                if (c > 0) {
                    // console.log("here");
                    User.findOne({ email: req.body.email }, 'username password', (err, pass) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            // console.log(pass);
                            if (pass.password == req.body.password) {
                                // var cookies = new Cookies(req, res, { keys: ['aarav key'] });
                                // cookies.set('email', req.body.email, { signed: true });
                                req.session.email = req.body.email;
                                req.session.username = pass.username;
                                req.session.validLogin = "true";
                                req.session.save();
                                res.redirect("/main");
                            }else{
                                res.render("login", { displayError: "visible", errorMssg: "Incorrect password !" });
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
                    res.render("login", { displayError: "visible", errorMssg: "This email is not registered." });
                }
            }
        });


    }

    // console.log(req.body);
})

app.post("/orglogin", (req, res) => {
    if (req.body.button == "orgregister") {
        // console.log("in here");
        const newOrg = new Org({
            orgname: req.body.username,
            orgemail: req.body.email,
            orgcontact: req.body.contact,
            orgpassword: req.body.password
        });

        let count;
        Org.countDocuments({ orgemail: req.body.email }, (err, c) => {
            if (err) {
                console.log(err);
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
                    res.render("orglogin", { displayError: "visible", errorMssg: "This email is already registered. Please Sign In." });
                }
            }
        });


    }
    if (req.body.button == "orglogin") {

        let count;
        Org.countDocuments({ orgemail: req.body.email }, (err, c) => {
            if (err) {
                console.log(err);
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
                                res.render("orglogin", { displayError: "visible", errorMssg: "Incorrect password !" });
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
                    res.render("orglogin", { displayError: "visible", errorMssg: "This email is not registered." });
                }
            }
        });


    }
})
