const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("static"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/testpoint", {useNewUrlParser: true});

const testSchema = mongoose.Schema({
    questions : String,
    test_name: String,
    test_desc: String,
    test_inst : String,
    tech_name: Array
});
const Test = mongoose.model("test", testSchema);


app.get("/", (req,res)=>{
    Test.find({},'test_name test_desc tech_name', (err, testInfos)=>{
        if (err) {
            console.log(err);
        }
        else {
                res.render('orgmain', {tinfo: testInfos});
                // console.log(testInfos.length);
        }
    });
    
    
    // res.sendFile(__dirname+"/x.html");
})
app.post("/", (req, res)=>{
    
})



app.listen(3000, ()=>{
    console.log("server started");
})

app.get("/test", (req, res)=>{
    res.render('test');
})

app.post("/test", (req,res)=>{
    let q = [];
    let len = Object.keys(req.body).length;
    for (i=0; i < (len-3); i++){
        q.push(req.body[i]) ;
    }
    console.log(q);
    const newTest = new Test({
        questions : JSON.stringify(q),
        test_name: req.body.testname,
        test_desc: req.body.description,
        test_inst: req.body.instructions,
        tech_name: req.body.techName
    });
    newTest.save();
    console.log(req.body);
})

app.get("/main", (req, res)=>{
    Test.find({},'test_name test_desc tech_name', (err, testInfos)=>{
        if (err) {
            console.log(err);
        }
        else {
                res.render('main', {tinfo: testInfos});
                // console.log(testInfos.length);
        }
    });
})
