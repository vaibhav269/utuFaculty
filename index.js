var express=require('express');
var app=express();
var bcrypt = require('bcrypt');
var bodyParser=require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');


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
                designation:{type: String,required: true,trim: true}
});

var collegeSchema=new mongoose.Schema({
        name:{type:String,required:true,trim:true},
        location:{type:String,required:true,trim:true},
        lat:{type: Number,required: true,trim: true},
        lng:{type: Number,required: true,trim: true},
        externalFaculty: {type: mongoose.Schema.Types.ObjectId, ref: 'faculty' },
        internalFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'faculty' }
});

var faculty=mongoose.model('faculty',facultySchema);
var hod=mongoose.model('hod',hodSchema);
var dean=mongoose.model('dean',deanSchema);
var admin=mongoose.model('admin',adminSchema);
var college=mongoose.model('college',collegeSchema);
//database connection end

app.get('/',function(req,res){
        sess = req.session;
        if(sess.offEmail){
                if(sess.designation=="1")
                        res.redirect('/logInFaculty');
                if(sess.designation=="1")
                        res.redirect('/logInFaculty');
                if(sess.designation=="1")
                        res.redirect('/logInFaculty');
        }
        else
                res.render('home');
});

/*app.get('/admin',function(req,res){
        userData=req.query;
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
*/



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

          model.findOne({offEmail:req.body.offEmail},function(err,userData){
                                if(userData!=null)
                                {
                                              bcrypt.compare(req.body.pass,userData.pass, function (err, result) {
                                                      if(err)
                                                                console.log(err);
                                                      else if(result===true)
                                                      {
                                                              sess.offEmail=req.body.offEmail;
                                                              sess.designation=req.body.designation;
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
                res.render('logInFaculty');
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
                });
        res.send(req.body.confirmId);
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
                faculty.find({confirm0:false},null,{sort:{createdAt:-1}},function(err,data){
                        data.forEach(function(val){                     //setting brach from code to string
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
                faculty.find({$and:[{confirm0:true},{confirm:false}]},null,{sort:{createdAt:-1}},function(err,facultyData){             //getting faculty data
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

                                        hod.find({confirm:false},null,{sort:{createdAt:-1}},function(err,hodData){             //getting hod data
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

app.listen(5000);
