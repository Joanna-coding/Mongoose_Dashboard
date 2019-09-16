const express = require("express");
const app = express();
app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

var session = require('express-session');
app.use(session({
    secret: 'keyboardkitty',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:6000}
}))

const flash = require('express-flash');
app.use(flash());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
    imageURL: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    age: {type: Number},

}, { timestamps: true});

const User = mongoose.model('User', UserSchema);

app.get('/', function(req,res){
    
    res.render("New");
})

app.post('/process', function(req,res){
    var user = new User();
    user.imageURL = req.body.imageURL,
    user.firstName = req.body.firstname,
    user.lastName = req.body.lastname,
    user.age = req.body.age
    user.save(function(err){
        if(err){
            res.redirect('/')
        }else{
            res.redirect('/index')
        }
    })
})

app.get('/index', function(req, res){
    User.find({}, function(err, userData){
        if(err || !userData){
            res.render('New')
        }else{
            // console.log("this is users;", userData)
            res.render('index', {users: userData})
        }
    })
})

// this is for the <form> tag from the ejs
// app.post('/delete/:burger', function(req,res){
//     console.log("testing route");
//     User.remove({_id: req.params.burger}, function(err){
//         if(err){
//             res.json(err)
//         }else{
//             res.redirect('/index')
//         }
//     })
// })

//this is for the <a> tag
app.get('/delete/:burger', function(req,res){
    console.log("testing route");
    User.remove({_id: req.params.burger}, function(err){
        if(err){
            res.json(err)
        }else{
            res.redirect('/index')
        }
    })
})

app.get('/user/new', function(req, res){
    res.render('New')
})

app.get("/edit/:id", function(req, res){
    User.findOne({_id: req.params.id}, function(err, data){
        if(err){
            res.json(err)
        }else{
            res.render('Edit', {data: data})
        }
    } )
    //res.render("Edit", {id: req.params.id})
})



app.post('/edit/:id', function(req,res){
    User.findOneAndUpdate({_id: req.params.id}, {$set:{
        imageURL: req.body.imageURL,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age
    }}, function(err, data){
        if(err){
            console.log("error", err);
        } else {
            console.log("this is the right datat:",data);

            res.redirect('/index');
           
        }
    });

})

app.post('/index', function(req,res){
    User.findByIdAndUpdate({_id: req.params.id},function(err){
        if (err) {
            console.log('something went wrong', err);
            res.render('update', { errors: user.errors })
        } else {
            console.log('successfully deleted a sheep!');
            res.redirect('/');
        }
    })
})





app.listen(5000, function(){
    console.log("listening to port 5000")
});