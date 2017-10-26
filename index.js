var express=require('express');
var app=express();
var bcrypt = require('bcrypt');
var bodyParser=require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var automateExternals = require('./automate.js');
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  auth: {
    user: 'yourEmail',
    pass: 'yourPassword'
  }
});

var mailOptions = {
                from: 'yourEmail',
                text: 'kindly report to the campus within 2 days for further formalities'
        };

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret: 'ssshhhhh'}));

app.set('view engine','ejs');

var sess;
//database connection start

mongoose.connect('mongodb://localhost/utu');

var facultySchema=new mongoose.Schema({
        name:{type: String,required: true,trim: true},
        perEmail:{type: String,required: true,trim: true},
        mobile:{type: String,required: true,trim: true},
        pass:{type: String,required: true},
        designation:{type: String,required: true,trim: true},
        CollegeName:{type: String,required: true,trim: true},
        CollegeCode:{type: String,required: true,trim: true},
        offEmail:{type: String,required: true,trim: true},
        expYears:{type: Number,required: true,trim: true},
        expMonths:{type: Number,required: true,trim: true},
        branch:{type: String,required: true,trim: true},

        practicalSubjects: [{type:String}],
        internalExam: [{type:String}],
        externalExam: [{collegeName:String,collegeLocation:String,subject:String}],

        confirm0:{type:Boolean},
        confirm:{type:Boolean}
},{timestamps:true});

var hodSchema=new mongoose.Schema({
        name:{type: String,required: true,trim: true},
        perEmail:{type: String,required: true,trim: true},
        mobile:{type: String,required: true,trim: true},
        pass:{type: String,required: true},
        designation:{type: String,required: true,trim: true},
        CollegeName:{type: String,required: true,trim: true},
        CollegeCode:{type: String,required: true,trim: true},
        offEmail:{type: String,required: true,trim: true},
        expYears:{type: Number,required: true,trim: true},
        expMonths:{type: Number,required: true,trim: true},
        dateJoinHod:{type: Date,required: true,trim: true},
        confirm:{type:Boolean}
},{timestamps:true});

var deanSchema=new mongoose.Schema({
        name:{type: String,required: true,trim: true},
        perEmail:{type: String,required: true,trim: true},
        mobile:{type: String,required: true,trim: true},
        pass:{type: String,required: true},
        designation:{type: String,required: true,trim: true},
        CollegeName:{type:String,required: true,trim: true},
        CollegeCode:{type: String,required: true,trim: true},
        offEmail:{type: String,required: true,trim: true},
        expYears:{type: Number,required: true,trim: true},
        expMonths:{type: Number,required: true,trim: true},
        dateJoinDean:{type: Date,required: true,trim: true},
        confirm:{type:Boolean}
},{timestamps:true});

var adminSchema=new mongoose.Schema({
                offEmail:{type:String,trim:true},
                pass:{type:String},
                designation:{type: String,required: true,trim: true},
                confirm:{type:Boolean}
});

var branchSchema=new mongoose.Schema({
        name:{type:String,required:true,trim:true},
        practicalSubjects: [{type: String,trim:true}]
});

var collegeSchema=new mongoose.Schema({
        name:{type:String,required:true,trim:true},
        code:{type: String,required: true,trim: true},
        location:{type:String,required:true,trim:true},
        lat:{type: Number,required: true,trim: true},
        lng:{type: Number,required: true,trim: true},
        externalFaculty: {type: mongoose.Schema.Types.ObjectId, ref: 'faculty' },
        internalFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'faculty' },
});

var internalFacultyFeedbackSchema=new mongoose.Schema({
        externalName:{type:String,required:true,trim:true},
        CollegeName:{type:String,required:true,trim:true},
        CollegeCode:{type:String,required:true,trim:true},
        branch:{type:String,required:true,trim:true},
        paperCode:{type:String,required:true,trim:true},
        paperName:{type:String,required:true,trim:true},
        examDate:{type: Date,required: true,trim: true},
        numOfStudents:{type: Number,required: true,trim: true},
        arrivalDate:{type: Date,required: true,trim: true},
        arrivalTime:{type:String,required:true,trim:true},
        departureDate:{type: Date,required: true,trim: true},
        departureTime:{type:String,required:true,trim:true},
        externalExaminerFeedback:{type:String,required:true,trim:true}
});

var externalFacultyFeedbackSchema=new mongoose.Schema({
        CollegeName:{type:String,required:true,trim:true},
        CollegeCode:{type:String,required:true,trim:true},
        branch:{type:String,required:true,trim:true},
        paperCode:{type:String,required:true,trim:true},
        paperName:{type:String,required:true,trim:true},
        examDate:{type: Date,required: true,trim: true},
        numOfStudents:{type: Number,required: true,trim: true},
        arrivalDate:{type: Date,required: true,trim: true},
        arrivalTime:{type:String,required:true,trim:true},
        departureDate:{type: Date,required: true,trim: true},
        departureTime:{type:String,required:true,trim:true},
        internalExaminerFeedback:{type:String,required:true,trim:true},
        collegeFeedback:{type:String,required:true,trim:true}
});

var faculty=mongoose.model('faculty',facultySchema);
var hod=mongoose.model('hod',hodSchema);
var dean=mongoose.model('dean',deanSchema);
var admin=mongoose.model('admin',adminSchema);
var college=mongoose.model('college',collegeSchema);
var branch=mongoose.model('practicalSubject',branchSchema);
var internalFacultyFeedback=mongoose.model('internalFacultyFeedback',internalFacultyFeedbackSchema);
var externalFacultyFeedback=mongoose.model('externalFacultyFeedback',externalFacultyFeedbackSchema);


//database connection end

app.get('/',function(req,res){
        sess = req.session;
        if(sess.offEmail){
                if(sess.designation=="1")
                        res.redirect('/logInFaculty');
                else if(sess.designation=="2")
                        res.redirect('/logInHod');
                else if(sess.designation=="3")
                        res.redirect('/logInDean');
                else if(sess.designation=="4")
                        res.redirect('/logInAdmin');
        }
        else{
                var data={};
                branch.find({},{name:1,_id:0},function(err,branchData){
                        data.branch=branchData;
                        college.find({},{name:1,code:1,_id:0},function(err,collegeData){
                                data.college=collegeData;
                                res.render('home',{data:data});
                        });
                });
        }
});

app.post('/admin',function(req,res){
        userData=req.body;
        bcrypt.hash(userData.pass, 10, function (err, hash){            //hashing the user's password before hashing
                if (err) {
                        console.log("error while hashing");
                    }
                 else{
                            userData.pass = hash;                                       //replacing original password with hash
                            admin.create(userData, function (err, user) {        //storing all data along with hashed password
                                    if (err){
                                            console.log(err);
                                    }
                                    else{
                                            console.log("saved");
                                    }
                        });
                }
        })
});




app.post('/signUpForm',function(req,res){
        function saveData(userData,model)
        {
                bcrypt.hash(userData.pass, 10, function (err, hash){            //hashing the user's password before hashing
                        if (err) {
                                console.log("error while hashing");
                            }
                         else{
                                    userData.pass = hash;                                       //replacing original password with hash
                                    model.create(userData, function (err, user) {        //storing all data along with hashed password
                                            if (err){
                                                    console.log(err);
                                            }
                                            else{
                                                    console.log("saved");
                                            }
                                });
                        }
                })
                res.send(req.body);
        }

        userData={
                name:req.body.name,
                perEmail:req.body.perEmail,
                pass:req.body.pass,
                designation:req.body.designation,
                offEmail:req.body.offEmail,
                mobile:req.body.mobile,
                CollegeName:req.body.CollegeName,
                CollegeCode:req.body.CollegeCode,
                expYears:req.body.expYears,
                expMonths:req.body.expMonths,
                confirm:false
        }
        var model=faculty;
        if(req.body.designation=="1")
        {
                        userData['branch']=req.body.branch;
                        userData['confirm0']=false;
        }
        if(req.body.designation=="2")
                {        userData['dateJoinHod']=req.body.dateJoinHod;
                        model=hod;
        }
        if(req.body.designation=="3")
        {                userData['dateJoinDean']=req.body.dateJoinDean;
                        model=dean;
        }
        saveData(userData,model);
});

app.post('/logInForm',function(req,res){
        sess = req.session;
        var model=faculty;
        if(req.body.designation=="2")
                        model=hod;

        if(req.body.designation=="3")
                        model=dean;

        if(req.body.designation=="4")
                        model=admin;

          model.findOne({$and:[{offEmail:req.body.offEmail},{confirm:true}]},function(err,userData){
                                if(userData!=null)
                                {
                                              bcrypt.compare(req.body.pass,userData.pass, function (err, result) {
                                                      if(err)
                                                                console.log(err);
                                                      else if(result===true)
                                                      {
                                                              sess.offEmail=req.body.offEmail;
                                                              sess.designation=req.body.designation;
                                                              sess.CollegeName=userData.CollegeName;
                                                              res.send(req.body.designation);
                                                      }
                                                        else
                                                                res.send("Wrong password");
                                              });
                                }
                                else{
                                        res.send("Email not found...Signup first");
                                }
           });
});

app.get('/logInFaculty',function(req,res){
        sess=req.session;
        if(sess.offEmail){
                faculty.findOne({offEmail:sess.offEmail},function(err,data){
                        /*demo values here for code testing

                        data.externalExam=[{collegeName:"COER",collegeLocation:"Fuck Fuck",subject:"computer"},{collegeName:"COER",collegeLocation:"Fuck Fuck",subject:"computer"}];
                        data.internalExam=["hello","brother"];
                        */
                        res.render('logInFaculty',{data:data});
                })
        }
        else
                res.redirect('/');
});

app.get('/logInAdmin',function(req,res){
        sess=req.session;
        if(sess.offEmail){
                        dean.find({confirm:false},null,{sort:{createdAt:-1}},function(err,data){
                                res.render('logInAdmin',{data:data});
                        });
        }
        else
                res.redirect('/');
});

app.post("/facultyConfirm0",function(req,res){
        faculty.update({_id:req.body.confirmId},{confirm0:true},function(err,raw){
                if (err) {
                        console.log(err);
                }
                });
        res.send(req.body.confirmId);
});

app.post("/facultyConfirm",function(req,res){
        faculty.update({_id:req.body.confirmId},{confirm:true},function(err,raw){
                        if (err) {
                                console.log(err);
                        }
                        else{
                                faculty.findOne({_id:req.body.confirmId},function(err,data){
                                                mailOptions.to=data.offEmail;
                                                mailOptions.subject="Job confirmation from college "+data.CollegeName;
                                                transporter.sendMail(mailOptions, function(error, info){
                                                        if (error) {
                                                        console.log(error);
                                                        } else {
                                                        console.log('Email sent: ' + info.response);
                                                        }
                                                });
                                });
                        }
                });
        res.send(req.body.confirmId);
});

app.post("/facultyUpdate",function(req,res){
        if(req.body.isExp=="true"){
                var propertyName0=req.body['propertyName[0]'];
                var propertyName1=req.body['propertyName[1]'];
                var propertyValue0=req.body['propertyValue[0]'];
                var propertyValue1=req.body['propertyValue[1]'];
                var updatedData={};
                updatedData[propertyName0]=propertyValue0;
                updatedData[propertyName1]=propertyValue1;

                faculty.update({offEmail:req.body.offEmail},updatedData,function(err,raw){
                        if (err) {
                                console.log(err);
                        }
                        else{
                                res.send("All set");
                        }
                });
        }

        else if(req.body.propertyName=="practicalSubjects"){
                var propertyName=req.body.propertyName;
                var propertyValue=req.body.propertyValue.split(',');
                propertyValue.forEach(function(data){
                        faculty.update({offEmail:req.body.offEmail},{$push:{practicalSubjects:data}},function(err,raw){
                                if (err) {
                                        console.log(err);
                                }
                                else{
                                        res.send("All set");
                                }
                        });
                });

        }

        else{
                var propertyName=req.body.propertyName;
                var propertyValue=req.body.propertyValue;
                var updatedData={};
                updatedData[propertyName]=propertyValue;

                faculty.update({offEmail:req.body.offEmail},updatedData,function(err,raw){
                        if (err) {
                                console.log(err);
                        }
                        else{
                                res.send("All set");
                        }
                });
        }
});

app.post("/facultyRemove",function(req,res){
        faculty.remove({_id:req.body.removeId},function(err,data){
                if(err)
                        console.log(err);
        });
        res.send(req.body.removeId);
});

app.get('/logInHod',function(req,res){
        sess=req.session;
        if(sess.offEmail){
                faculty.find({$and:[{confirm0:false},{CollegeName:sess.CollegeName}]},null,{sort:{createdAt:-1}},function(err,data){
                        data.forEach(function(val){                     //setting branch from code to string
                                        if(val.branch=="1")
                                                val.branch="CSE";
                                        else if(val.branch=="2")
                                                val.branch="IT";
                                        else if(val.branch=="3")
                                                val.branch="Civil";
                                        else if(val.branch=="4")
                                                val.branch="Mechanical";
                                        else if(val.branch=="5")
                                                val.branch="EC";
                                        else if(val.branch=="6")
                                                val.branch="Electrical";
                                        });
                                        res.render('logInHod',{data:data});
                        });
        }
        else
                res.redirect('/');
});

app.post("/hodConfirm",function(req,res){
        hod.update({_id:req.body.confirmId},{confirm:true},function(err,raw){
                if (err) {
                        console.log(err);
                }
                else{
                        hod.findOne({_id:req.body.confirmId},function(err,data){
                                        mailOptions.to=data.offEmail;
                                        mailOptions.subject="Job confirmation from college "+data.CollegeName;
                                        transporter.sendMail(mailOptions, function(error, info){
                                                if (error) {
                                                console.log(error);
                                                } else {
                                                console.log('Email sent: ' + info.response);
                                                }
                                        });
                        });
                }
                });
        res.send(req.body.confirmId);
});

app.post("/hodRemove",function(req,res){
        hod.remove({_id:req.body.removeId},function(err,data){
                if(err)
                        console.log(err);
        });
        res.send(req.body.removeId);
});


app.get('/logInDean',function(req,res){
        var data={};                               //taking a variable to store data of faculty and hod both
        sess=req.session;
        if(sess.offEmail){
                faculty.find({$and:[{confirm0:true},{confirm:false},{CollegeName:sess.CollegeName}]},null,{sort:{createdAt:-1}},function(err,facultyData){             //getting faculty data
                        facultyData.forEach(function(val){                     //setting brach from code to string
                                        if(val.branch=="1")
                                                val.branch="CSE";
                                        else if(val.branch=="2")
                                                val.branch="IT";
                                        else if(val.branch=="3")
                                                val.branch="Civil";
                                        else if(val.branch=="4")
                                                val.branch="Mechanical";
                                        else if(val.branch=="5")
                                                val.branch="EC";
                                        else if(val.branch=="6")
                                                val.branch="Electrical";
                                        });
                        data.faculty=facultyData;

                                        hod.find({$and:[{confirm:false},{CollegeName:sess.CollegeName}]},null,{sort:{createdAt:-1}},function(err,hodData){             //getting hod data
                                                data.hod=hodData;
                                                res.render('logInDean',{data:data});                      //sending hod and faculty data to logInDean
                                        });
                        });
        }
        else
                res.redirect('/');
});

app.post("/deanConfirm",function(req,res){
        dean.update({_id:req.body.confirmId},{confirm:true},function(err,raw){
                if (err) {
                        console.log(err);
                }
                else{
                        dean.findOne({_id:req.body.confirmId},function(err,data){
                                        mailOptions.to=data.offEmail;
                                        mailOptions.subject="Job confirmation from college "+data.CollegeName;
                                        transporter.sendMail(mailOptions, function(error, info){
                                                if (error) {
                                                console.log(error);
                                                } else {
                                                console.log('Email sent: ' + info.response);
                                                }
                                        });
                        });
                }
                });
        res.send(req.body.confirmId);
});

app.post("/deanRemove",function(req,res){
        dean.remove({_id:req.body.removeId},function(err,data){
                if(err)
                        console.log(err);
        });
        res.send(req.body.removeId);
});

app.post('/branchEnter',function(req,res){
        var userData={};
        userData.name=req.body.name;
        userData.practicalSubjects=req.body.practicalSubjects.split(',');
        branch.create(userData, function (err, user) {        //storing all data 
                if (err){
                        console.log(err);
                }
                else{
                        console.log("saved");
                        res.send("All set");
                }
    });
});

app.post('/collegeEnter',function(req,res){
        college.create(req.body, function (err, user) {        //storing all data along with hashed password
                if (err){
                        console.log(err);
                }
                else{
                        console.log("saved");
                        res.send("All set");
                }
    });
});

app.get('/logout',function(req,res){
        var sess=req.session;
                sess.destroy();
                res.redirect('/');
});


app.post('/externalFeedback',function(req,res){
        console.log(req.body);
        var userData=req.body;
        externalFacultyFeedback.create(userData, function (err, user) {        //storing all data along with hashed password
                if (err){
                        console.log(err);
                }
                else{
                        res.send("All Set");
                }
    });
});

app.post('/internalFeedback',function(req,res){
        var userData=req.body;
        internalFacultyFeedback.create(userData, function (err, user) {        //storing all data along with hashed password
                if (err){
                        console.log(err);
                }
                else{
                        res.send("All Set");
                }
    });
});

app.post('/automate',function(req,res){
        college.find({},function(err,colleges){
                if(err){
                        return console.log(err);
                }

                for(let m=0;m<colleges.length;m++){
                        srcCollege = colleges[m].name;
                        automateExternals.automate(srcCollege,faculty,college,branch,function(){
                                console.log("automate practicals...");
                                res.send("Practicals Automated");
                        });
                     //  console.log(srcCollege);
                }
        });
});

app.listen(5000);
