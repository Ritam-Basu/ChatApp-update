const express=require('express');
const nodemailer=require('nodemailer');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const http=require('http');//
const {Server}=require('socket.io');
const cors=require('cors');
const { type } = require('os');
const cookieParser=require('cookie-parser');
const cookie=require('cookie')





    



// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';

const app=express();
const server=http.createServer(app);
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(express.static('pages'));

app.use(express.static('public'));

app.get('/login',(req,resp)=>{
    resp.sendFile('./pages/login.html',{root:__dirname});
})



app.use(cookieparser());
//ntir odgf tbfk gnon
mongoose.connect('mongodb+srv://ritambasus9:Vj3rFhGqNGih17nN@cluster0.xm8x2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(
    (db)=>{
        console.log("connected to db");
    }
).catch((err)=>{
    console.log(err);
})
const userschema=mongoose.Schema({
    phoneno:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    }
   
})
const usermodel=mongoose.model('roomids',userschema);





let otpgenerator;
app.get('/',(req,res)=>{
    console.log('Heyy server');
    res.sendFile('./pages/index.html',{root:__dirname});
})

app.post('/loginpage', (req, resp) => {
    // if(req.url!='/login')resp.send('no cookie change');
    console.log(req.body.phone);

    resp.cookie('phoneNo', req.body.phone, {
        secure: true,  // Change to true if you're using HTTPS
        httpOnly: true,
        sameSite: 'lax' // or 'none' for cross-site cookies
    });

    resp.status(200).send('Cookie set successfully');
});
app.post('/verify',(req,resp)=>{
    if(req.body.otp===111){
        
        resp.status(200).send('otp verified!!');
    }
    else{
        resp.status(404).send('otp is invalid');
    }
})


app.get('/chatbox',(req,res)=>{
    res.sendFile('./pages/chatbox.html',{root:__dirname});
})

////////////////////////////////////////////////////////////////////
app.post('/auth/signup',(req,resp)=>{
    console.log(req.body);
    function generateOTP() {
        // Generate a random number between 100000 and 999999
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp;
    }
     otpgenerator=generateOTP();
    async function sendmail() {
        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'basuritam23@gmail.com',
                pass:'ntir odgf tbfk gnon'

                

            }
        });
        const mailOptions = {
            from: 'basuritam23@gmail.com',
            to: req.body.email,
            subject: 'OTP FOR CHATAPP',
            text: 'your otp is '+`${otpgenerator}`,
        }
        try{
    const res=await transporter.sendMail(mailOptions);




    

    //console.log(res);
    const user={
        phoneno:req.body.ph,
        name:req.body.name,
        email:req.body.email,

    }
    const respval=await usermodel.create(user);
    console.log( "hi",respval);
       
    
    // resp.cookie('phoneNo',req.body.ph,{secure:true,httponly:true});
    // resp.cookie('email',req.body.email,{secure:true,httponly:true});
    // resp.cookie('name',req.body.name,{secure:true,httponly:true});
    // resp.cookie('isloggedin',true,{secure:true,httponly:true});

    resp.status(200).send('Signup Successfull');
        
    
        }catch(err){
            console.log(err);
            resp.status(404).send('something went wrong babes');
            
        }
        
        
    }
    sendmail();
    

})







const chatSchema = new mongoose.Schema({
    roomno: { type: Number, required: true }, // Unique identifier for the chat room
  // Reference to User
     phoneno:{type:Number,required:true},
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  });
  

  const Chat = mongoose.model('Chat', chatSchema);

  async function storeMessage(roomno,num,  messageContent) {
    try {
      const newMessage = new Chat({
        roomno: roomno,
         phoneno:num,
        message: messageContent,
        
      });
      await newMessage.save();
      console.log('Message stored successfully');
    } catch (err) {
      console.error('Error storing message:', err);
    }
  }













//////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/optvalidate',(req,resp)=>{
    if(req.body.otp==otpgenerator){


        resp.status(200).send('otp is valid');
    }else{
        resp.status(404).send('otp is invalid');
    }
})
// // function addtomongodb(roomid,phoneNo,name1){

// }
app.get('/getcookies', (req, res) => {
    const phoneNo = req.cookies.phoneNo || ''; // Fallback to empty string if cookie is not set
    res.json({ phoneNo }); // Send JSON response
});
app.get('/search',  async(req, res) => {
    // console.log(req.query.PHONE);
    // let user=await usermodel.findOneAndUpdate({
    //     phoneno:req.query.PHONE
    // })
    // console.log(user);
    try{
        let user=await usermodel.findOne({
            phoneno:req.query.PHONE
        })
        console.log("hi",user);
        if(!user){
            res.status(404).send('user not found');
        }else{
            res.status(200).send(user);

        }
    }catch(err){
        console.log(err);
    }

    
    // try {
    //     const user = await usermodel.findOne({ phoneno: id });
        
    //     if (!user) {
    //         // Send a 404 status code if the user is not found
    //         return res.status(404).json({ message: 'User not found' });
    //     }

    //     console.log("User found:", user);
    //     res.status(200).json(user); // Send the user data with a 200 status code
    // } catch (err) {
    //     console.error('Error occurred:', err);
    //     res.status(500).json({ message: 'Internal server error' }); // Send a 500 status code if an error occurs
    // }
});
// async function getoldchats(roomno) {
//     const resp=await Chat.findOne({roomno:roomno}).
    


// }
app.get('/getchathistory/:roomid', async (req, resp) => {
    try {
        console.log("roomno111", req.params.roomid);

        // Fetch the last 50 messages for this room, sorted by timestamp descending
        const messages = await Chat.find({ roomno: Number(req.params.roomid) })
            .sort({ timestamp: -1 }) // Sort by timestamp descending
            .limit(50); // Limit to the last 50 messages

        // Reverse the result so messages are in ascending order
        const orderedMessages = messages.reverse();

        // Fetch user data for each message
        const messagesWithUsernames = await Promise.all(orderedMessages.map(async (message) => {
            const user = await usermodel.findOne({ phoneno: message.phoneno }).exec();
            return {
                ...message.toObject(), // Convert message to plain object
                username: user ? user.name : message.phoneno // Attach username or 'Unknown' if user not found
            };
        }));

        // Send the response with the ordered messages and usernames
        resp.json(messagesWithUsernames);
    } catch (err) {
        console.error("Error in retrieving from db", err);
        resp.status(500).json({ error: 'Internal server error' });
    }
});





const io=new Server(server);
io.on("connection",async (socket)=>{
    socket.on('answer',sendanswer);
    function sendanswer(offer){
       console.log("ans called");
       
        
        socket.broadcast.emit('backanswer',offer);
    }


    socket.on("offer",sendoffer);
    function sendoffer(offer){
        console.log("offer called");
       socket.broadcast.emit("backoffer",offer);
        
    }

    // const req = socket.request;
    // console.log(req);
    // var cookief = socket.handshake.headers.cookie; 
    // var cookies = cookie.parse(socket.handshake.headers.cookie); 
    // console.log(cookies.name);


// Access cookies
//     const cookies = req.headers.cookie;

//      Access a specific cookie value
//     const parsedCookies = cookieParser.JSONCookies(cookieParser.signedCookies(req.headers.cookie));
    // const name1 = cookies.name;
    //  const phoneNo1 = cookies.phoneNo;
    
// console.log(name1);
// console.log(phoneNo1);
// console.log(socket.id);

    socket.on('cnt',({phone1,phone2})=>{
    
    const roomno=Number(phone1)+Number(phone2);
    console.log("roomno",roomno);
    socket.join(roomno);
    

    
    })
    socket.on('message',async (data)=>{
    console.log(data.msg);
    console.log(data);

    const roomno=Number(data.phone1)+Number(data.phone2);
    console.log("roomno",roomno);
    storeMessage(roomno,data.phone2,data.msg);
    let sender;
     try{
      sender= await usermodel.findOne({ phoneno: data.phone2 });//phone 2 is resp for sending that he has sent the message 
      console.log(sender);
      socket.to(roomno).emit("msg",{txt:data.msg,sender:sender.name});
      
     }catch{
        console.log("sender not found");
        socket.to(roomno).emit("msg",{txt:data.msg,sender:"USER"});
     }
   

  })



   // const user={
    //     phoneno:phoneNo1,
    //     name:name1,
    //     roomid:socket.id,

    // }
    // const respval=await usermodel.create(user);
    // console.log(respval);
    

    
    console.log("a user connected");

    socket.on("disconnect",()=>{
        console.log("a user disconnected");
    })
})

// io.on("cnt", (socket) => {
//     console.log("A user connected");

//     socket.on('message', (data) => {
//         console.log('Received message:', data);

//         const roomno = Number(data.phone1) + Number(data.phone2);
//         console.log("Room number:", roomno);

//         socket.broadcast.to(roomno).emit("msg", { txt: data.msg });
//     });

//     socket.on("disconnect", () => {
//         console.log("A user disconnected");
//     });
// });




app.get('/chatface',(req,resp)=>{
    resp.sendFile('./pages/chatface.html',{root:__dirname});
})
app.get('/otp',(req,resp)=>{

    resp.sendFile('./pages/otpverifypage.html',{root:__dirname});

})

server.listen(3000,()=>{
    console.log('Server is running on port 3000');
})