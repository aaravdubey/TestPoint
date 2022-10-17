const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));



mongoose.connect('mongodb+srv://admin-daivik:testpoint@cluster0.3hbsmke.mongodb.net/testpoint');

const testSchema = mongoose.Schema({
    questions: String,
    org_name: String,
    org_email: String,
    test_name: String,
    test_desc: String,
    test_inst: String,
    tech_name: Array,
});

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

const Test = mongoose.model('Test', testSchema);
const Result = mongoose.model('Result', resultSchema);

app.get('/', async function(req ,res) {
    await Test.findById({_id: "63316dc5f66da159efa5378e"}, function(err, test){
        if(err){
            console.log(err);
        }else{
             let arr = JSON.parse(test.questions);    
                res.render('index', { 
                    arr: arr,
                    tstname: test.test_name,
                    desc: test.test_desc,
                    inst: test.test_inst,
                    timex: 1
            });
            // console.log(arr[1][1][0]);
        }
    }).clone().catch(function(err){console.log(err)})
})

app.post('/',  async function(req, res){
    let marks = 0, totalmarks = 0;
    let org_email = "";
    let test_id = "";
    let test_name = "";
    await Test.findById({_id: "63316dc5f66da159efa5378e"}, function(err, test){
        if(err){
            console.log(err);
        }else{
            org_email = test.org_email;
            test_id = test.id;
            test_name = test.test_name; 
            let arr = JSON.parse(test.questions);    
             for(i = 0; i< arr.length-1; i++){
                //console.log(req.body[i]);
                totalmarks += parseInt(arr[i][3]);
                if(req.body[i].length == arr[i][2].length){
                    for(k = 0; k< arr[i][2].length; k++){
                        if(req.body[i][k] != arr[i][2][k]){
                            continue;
                        }
                        if(k == arr[i][2].length - 1){
                            marks += parseInt(arr[i][3]);
                        }  
                    }  
                }else{
                    //no marks
                }            
            }
            let date_ob = new Date();
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let date = year + "-" + month + "-" + day;
            let time = hours + ":" + minutes;
            const result = new Result({
                test_id: test_id,
                marks: marks,
                totalmarks: totalmarks,
                username: "Daivik Gawande",
                email:"daivik@gmail.com",
                org_email: org_email,
                test_name: test_name,
                time: time,
                date: date
            })
            result.save(); 
        }
    }).clone().catch(function(err){console.log(err)})
})


app.listen(3000, function() {
    console.log('server is running');
})