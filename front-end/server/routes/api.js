const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
let db = require('../data');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = db.Member;
const Info = db.EventInfo;
const Event = db.Event;
const constants = require('../../config/constants');



// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// ============== !START! FORMATTER REGISTRATION AND LOGIN =========================

// REGISTERATION OF A USER
// tested, receive a complete USER of Member Schema
router.post('/registration',(req,res,next)=>{

    let newUser = new User(req.body);

    // check whether user exists and use addUser as call back function
    User.getUserByUsername(newUser.username,(err1,user)=>{
        if (err1){
            res.json({success:false,msg:'Failed to check username due to error'});
        }
        if (user){
            res.json({success:false,msg:'User Already Exists, please choose another username'});
        }
        else{
            User.addUser
            (newUser,(err2,user) => {
                if(err2){
                    res.json({success:false,msg:'Failed to register user due to error'});
                }else{
                    res.json({success:true,msg:'User Registered'});
                }
            })
        }
    })


});


// AUTHENTICATE A USER WHEN LOGGING IN
// tested, receive JSON with username and password
router.post('/authenticate',(req,res,next)=>{
    // res.send('authorization Page');
    let username = req.body.username;
    let password = req.body.password;

    User.getUserByUsername(username,(err,user) => {
        if(err) throw err;
        if(!user){
            return res.json({success:false,msg:'User Not Found'});
        }else{
            User.authorization(password,user.activationToken,(err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    let token = jwt.sign({data:user},constants.secret,{
                        expiresIn: 60 //user expire in seconds
                    });

                    res.json({
                        success:true,
                        msg: "You have logged In successfully!",
                        token:'JWT ' + token,
                        user: {
                            firstName:user.firstName,
                            lastName:user.lastName,
                            username:user.username,
                            email:user.email,
                            phone:user.phone,
                            socialMedia:user.socialMedia,
                            permission:user.permission,
                            activated:user.activated
                        }
                    })
                }else{
                    res.send("Logged In Successfully");
                    return res.json({success:false,msg:'Wrong Passwords'});
                }



            })
        }
    })
});


// Authorization for profile under construction
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    // res.send('Profile Page');
    res.json({user:req.user});
    // res.redirect();
});




// ============= FORMATTED REGISTRATION LOGIN !END! =========================




// =================== !START! FORMATTED PROFILE UPDATE =========================

// Authorization for change of profile Under Construction
// raw , receive memberSchema formatted data for both new and old users
router.put('/change/profile',(req,res,next)=>{
    // user to update
    let newUser = req.body;

    // // validate the _id
    // if(!ObjectId.isValid(newUser._id)){
    //     return res.json({success:false,msg:"User to probably not extracted from database"});
    // }

    // find the user of specific id
    User.getUserByUsername(newUser.username,(err1,user1)=>{
        if(err1) return res.json({success:false,msg:"Error Finding User of Given ID"});
        if(!user1) return res.json({success:false,msg:"User Not Found"});
        else{
            // replace user by newUser
            let query = {username:newUser.username};
            User.updateUser(query,newUser,(err2,user2) =>{
                if(err2) return res.json({success:false,msg:"Error Updating User"});
                else return res.json({success:true,msg:"User Updated!"});
            })
        }
    });
})


// USER CHANGE PASSWORD AND HASH ACTIVATIONTOKEN
// raw, receive the user as well as its new password
router.put('/change/password',(req,res,next)=>{
    let newpass = req.body.newpass;
    let cur_user = req.body.user;


    User.changePassword(cur_user,newpass,(err,date)=>{
        if(err) return res.json({success:false,msg:`Error Changing password for ${cur_user.username}`});
        else{
            // need to check the value of data, but put aside
            return res.json({success:true,msg:"Password Changed"});
        }
    })
})





// USER REMOVE A SPECIFIC EVENT FROM SCHEDULE
// raw, receive username and eventid string from req
router.delete('/quit/event/:username/:eventid',(req,res,next)=>{
    let username = req.params.username;
    let eventid = req.params.eventid;

    Info.removeEventInfo(username,eventid,(err,data)=>{
        if(err) return res.json({success:false,msg:`Error Removing Event ${eventid} for ${username}`});
        else{
            // actually need to check the value of the object, just put it aside for a while
            return res.json({success:true,msg:"Event Deleted"});
        }
    })
})


// GET USER BY USER NAME
// tested , req provides only the username
router.get('/user/:username',(req,res,next)=>{
    let username = req.params.username;
    User.getUserByUsername(username,(err,user)=>{
        if(err) return res.json({success:false,msg:`Error Finding User for ${username}`});
        if(!user) return res.json({success:false,msg:`No Such User`});
        return res.json({success:true,msg:`User Founded`,data:user});
    })
})


// ============= FORMATTED PROFILE UPDATE !END! =========================





// =================== !START! FORMATTED EVENTINFO SEND =========================


// USER JOIN EVENT,AUTHORIZATION OF THIS FORM REMAIN TO BE DONE
// tested , receive eventInfoSchema formatted data
router.post('/join/event',(req,res,next)=>{
    // event to register
    let EI = new Info(req.body);
    // check whether the user has already registered for this event
    Info.checkEventInfoExistence(EI.username,EI.eventid,(err1,event1)=>{
        if(err1) return res.json({success:false,msg:"Error checking the existence of the eventInfo"});
        if(event1) return res.json({success:false,msg:"You already registered."});

        Info.addEventInfo(EI,(err2,event2)=>{
            if(err2) return res.json({success:false,msg:"Error Registering event"});
            return res.json({success:true,msg:"Signed Up successfully!"});
        });

    })
})


// FIND ALL EVENTS A USER REGISTERED GIVEN USERNAME
// raw, receive username
router.get('/eventinfo/:username',(req,res,next)=>{
    let username = req.params.username;
    Info.getEventsByUsername(username,(err,data)=>{
        if(err) return res.json({success:false,msg:`Failed to get events for ${username}`});
        else{
            return res.json({success:true,msg:"Got Events",events:data});
        }
    })
})



// ============= FORMATTED EVENTINFO SEND !END! =========================



// ===================== FORMATTED EVENT !END! =========================
router.get('/events', (req, res) => {
  db.Event.find({}).then((events) => {
    response.data = events;
    res.send(response);
  }).catch((e) => {
    res.status(400).send()
  })
});

router.get('/events/:id', (req, res) => {
  let id = req.params.id
  if (!ObjectId.isValid(id)) {
    return res.status(404).send('ID is not valid')
  }
  db.Event.findById(id).then((event) => {
    if (!event) {
      return res.status(404).send()
    }
    response.data = event;
    res.send(response)
  }).catch((e) => {
    res.status(400).send()
  })
});

router.delete('/eventjoin/:user/:event', (req, res) => {
  let user = req.params.user;
  let event = req.params.event;

  db.EventInfo.remove({eventid: event, username: user}, function(err, data){
    if(err) {
      response.message = "Could not delete"
      res.satatus(500).send();
    } else {
      response.message = "Deleted successfully!";
      res.send(response);
    }
  })
});



  router.get('/peopleattend/:id', (req, res) => {
    var eventid = req.params.id
    db.EventInfo.aggregate([
      {
        $lookup: {
          from: "members" , localField: "username", foreignField: "username", as: "user_info"
        }
      },
      {
        $match: { "eventid": eventid }
      }
    ]).then((peopleAttend) => {
      response.data = peopleAttend;
      res.send(response);
    }).catch((e) => {
      res.status(400).send()
    })
  })

  router.get('/peopleattend', (req, res) => {
    db.EventInfo.find({}).then((peopleAttend) => {
      response.data = peopleAttend;
      res.send(response);
    }).catch((e) => {
      res.status(400).send()
    })
  })

  router.get('/messages', (req, res) => {
    db.Message.aggregate(
      [
        { $sort : { date : -1} }
      ]
    ).then((messages) => {
      response.data = messages;
      res.send(response);
    }).catch((e) => {
      res.status(400).send()
    })
  })


  router.post('/messages', (req,res) => {
    if (!req.body.message_id || ! req.body.message) {
      response.message = "Please include an message_id and a message"
      res.status(400).send(response);
    } else {
      db.Message.find({"message_id": req.body.message_id}).then((message) => {
        if (message[0] == null) {
          let info = {
            message_id: req.body.message_id,
            message: req.body.message,
            date: new Date()
          }
          let message = new db.Message(info);
          message.save(function(err, task) {
            if (err){
              res.status(400).send();
            } else {
              response.message = "Successfully post a message!"
              response.data = []
              res.send(response)
            }
          })

        } else {
          response.message = "The message id is already existed, please choose a different one."
          res.status(400).send(response);
        }
      })
    }
  })

  router.delete('/messages/:message_id', (req,res) => {
    var message_id = req.params.message_id;
    db.Message.remove({"message_id": message_id}, (err, data) => {
      if(err) {
        response.status = 400
        response.message = "Cannot delete"
        res.status(400).send(response)
      } else {
        response.message = "Successfully delete the message!"
        res.send(response);
      }
    })
  })

  router.get('/messages/current', (req,res) => {
    db.Message.aggregate(
      [
        { $sort : { date : -1} }
      ]
    ).then((messages) => {
      response.data = messages[0];
      res.send(response);
    }).catch((e) => {
      res.status(400).send()
    })
  })

module.exports = router;
//mongoimport --jsonArray --db roadtrippers --collection events --file events.json
