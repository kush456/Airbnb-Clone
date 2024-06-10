const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config()
const app = express();
const port = 4000;


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials : true,
    origin : true
}));

//the fact that we put DID NOT it in a string might cause problems

mongoose.connect(process.env.MONGO_URL);


function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    });
}

app.get('/test', (req,res) => {
    try{
        res.json('test ok');
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : err.message
        });
    }
});

app.post('/register', async (req,res) =>{
    try{
        const {name,email,password} = req.body;
        const UserDoc = await User.create({
            name: name ,
            email: email ,
            password:bcrypt.hashSync(password, bcryptSalt)//sync so that it returns a password directly instead of a promise
        });
        // we await the creation of a user then only do we send the response to the client side 
        res.json(UserDoc);
    } catch(e){
        res.status(409).json(e);
    }
    
});


app.post('/login', async (req,res) =>{
    try{
        const {email,password} = req.body;
        const UserDoc = await User.findOne({email});//UserDoc is first instance of an object with the entered email
        if(UserDoc){
            const passOk = bcrypt.compareSync(password, UserDoc.password);
            if(passOk){
                jwt.sign({email: UserDoc.email, id : UserDoc._id}, jwtSecret, {}, (err,token) =>{
                    if(err) throw err;
                    res.cookie('token', token, {
                        secure : true,
                        sameSite : 'none'
                    }).json({
                        success: true,
                        message : 'Login successful',
                        UserDoc,
                    });//here the second parameter of the callback is the generated toke by jwt.sign method, other would be to use async await and define a variable
                });
            } else{
                res.json({
                    success: false,
                    message : 'Incorrect Password',
                });
            }
        } else{
            res.json({
                success: false,
                message: 'User not found',
            });
        }
    } catch(e){
        res.status(409).json({
            success: false,
            message: e.message,
        });
    }
    
});

app.get('/profile', (req,res) =>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async (err,user) => {
            if(err) throw err;
            const {name, email, _id} = await User.findById(user.id);
            res.json({name, email, _id});
        });
    } else{
        res.json(null);
    }
});

app.post('/logout', (req,res) => {
    res.clearCookie('token');
    res.json({message : 'Logged out successfully'});
});

app.post("/upload-by-link", async (req,res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url : link,
        dest : __dirname + '/uploads/' +newName, //always adviced to add full directory name if you are removing/moving files like here 
        //yaha se timeout hataya hai dekhlena 
    });
    res.json(newName);
});

const upload = multer({dest : 'uploads'});//middleware for multer
app.post("/upload", upload.array('photos',100), async (req,res) => { //'photos' as thats the name as we sent it to the server from the client 
    const uploadedFiles =[];
    for(let i=0; i<req.files.length; i++){
        const {path, originalname} = req.files[i]; //these two are properties as we could see in the console
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\',''));
    }
    res.json(uploadedFiles);
});

app.post('/places', async (req,res) =>{
    //we need to add this data to the schema 
    const {token} = req.cookies;
    const {
        title,address, addedPhotos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err,user) => {
        if(err) throw err;
        //here because it is like else do this 
        const newPlace = await Place.create({
            owner : user.id,//no need for all the colons as same names hai a very frequently used concept 
            title,address, photos:addedPhotos,
            description,perks,extraInfo,
            checkIn,checkOut,maxGuests,price
        });
        res.json(newPlace);
    });
});

//lets get the data it requires
app.get('/user-places', (req,res) => {//we need to imo, update all these places routes to user-places tbh which will be gruesome 
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err,user) => {
        const {id} = user;
        res.json(await Place.find({owner:id}));//retrieves all the places listed with the user's id in the database
    });
});

app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async(req,res) => {
    const {token} = req.cookies;
    const {
        id,
        title,address, addedPhotos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err,user) => {
        if(err) throw err;
        const placeDoc = await Place.findById(id);
        if(user.id === placeDoc.owner.toString()) {//as this was an ObjectId at first 
            placeDoc.set({
                title,address, photos:addedPhotos,
                description,perks,extraInfo,
                checkIn,checkOut,maxGuests,price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places' , async (req,res) => {
    res.json(await Place.find());
})

app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body ;
    const newBooking = await Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price, user : userData.id, 
    }).then((doc) => {
        res.json(doc);
      }).catch((err) => {
        throw err;
      });
    
})

app.get('/bookings', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromReq(req);
    res.json( await Booking.find({user:userData.id}).populate('place'));
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}. `);
});