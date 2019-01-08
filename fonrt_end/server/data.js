let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/roadtrippers";
var url2 = "mongodb://localhost:27017/social";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});


let eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        // type: Date,
        type: String,
        required: true
    },
    briefdescription: {
        type: String,
        required: true
    },
    departLat: {
        type: Number,
        required: true
    },
    departLng: {
        type: Number,
        required: true
    },
    destLat: {
        type: Number,
        required: true
    },
    destLng: {
        type: Number,
        required: true
    },
    description:{
        type: [String],
        require: true
    },
    image:{
        // type: File,
        type: String,
        required: true
    },
    hostname :{
        type: String,
        required: true,
        default: "Anonymous"
    }
}, {
    collection: 'events'
});


let memberSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    permission: {
        type: Number,
        default:0
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    socialMedia: {
        type: String
    },
    // profilePhoto: {
    //     type: String,
    //     default: undefined
    // },
    activationToken: {
        type: String
    },
    activated: {
        type: "boolean", default: false
    },
    passwordInitialized: {
        type: "boolean", default: false
    }
}, {
    collection: 'members'
});


let eventInfoSchema = new Schema({
    name:{
        type:String,
        default: "undefined",
    },
    eventid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    ifVehicle: {
        type: Boolean,
        required: true
    },
    peopleAttend: {
        type: Number,
    },
    seatAvailable: {
        type: Number,
    },
    note: {
        type: String,
        default: ""
    }
}, {
    collection: 'eventInfo'
});

let messageSchema = new Schema({
    message:{
        type: String,
        default: "undefined",
    },
    message_id: {
        type: String,
        required: true,
        unique: true
    },
    date: {
      type: Date
    }
}, {
    collection: 'messages'
});


let userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        // type: Date,
        type: String,
        required: true
    },
    screen_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    followers_count: {
        type: Number,
        required: true
    },
    friends_count:{
        type: Number,
        require: true
    },
    lang:{
        // type: File,
        type: String,
        required: true
    },
    profile_background_image_url :{
        type: String,
        required: false,
    }
}, {
    collection: 'users'
});
// memberSchema.plugin(passportLocalMongoose, {
//     usernameField: 'UTmail'
// });

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/roadtrippers', { useMongoClient: true }, function(err, db) {
  if(!err) {
    console.log("connected to database mongodb://localhost:27017/roadtrippers");
  }
});






let schema = {
    'Member': mongoose.model('members', memberSchema),
    'EventInfo': mongoose.model('eventInfo', eventInfoSchema),
    'Event': mongoose.model('events', eventSchema),
    'Message': mongoose.model('messages', messageSchema),
    'Users': mongoose.model('users', userSchema)
};
module.exports = schema;



// ============ PASSPORT AND USER RELATED ========================

// get the user by id, note : this id is _id
// raw
module.exports.Member.getUserById = function(id,callback){
    schema.Member.findById(id,callback);
}

// get the User by its username
// tested
module.exports.Member.getUserByUsername = function(username,callback){
    let query = {username:username};
    schema.Member.findOne(query,callback);
}

module.exports.Users.getTwitterUser = function(id,callback){
    let query = {id:id};
    schema.Member.findOne(query,callback);
}

// add the user to the database , on registration
// tested
module.exports.Member.addUser = function(newUser,callback){
    bcrypt.genSalt(10,(err,salt ) => {
        bcrypt.hash(newUser.activationToken,salt,(err,hash)=>{
            if(err) throw err;
            newUser.activationToken = hash;
            newUser.save(callback);
        })
    })
}

// authorization procedure of the logging in system
// tested
module.exports.Member.authorization = function(password,activationToken, callback){
    bcrypt.compare(password,activationToken,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    });
}

// update the profile of the user
// tested
module.exports.Member.updateUser = function(query,new_user, callback){
    schema.Member.update(query,new_user,callback);
}


// change the user's password
// raw
module.exports.Member.changePassword = function(user,newpass,callback){
    bcrypt.genSalt(10,(err,salt ) => {
        bcrypt.hash(newpass,salt,(err,hash)=>{
            if(err) throw err;
            let updateField = {activationToken:hash};
            schema.Member.update(user,updateField,callback);
        })
    })
}


// ================ EVENT JOIN RELATED ========================


// get all events a user signed up from db
// raw
module.exports.EventInfo.getEventsByUsername = function(username,callback){
    let query = {username:username};
    schema.EventInfo.find(query,callback);
}

// get the eventInfo data based on user name and event id
// tested
module.exports.EventInfo.checkEventInfoExistence = function(username,eventid,callback){
    let query = {username:username,eventid:eventid};
    schema.EventInfo.findOne(query,callback);
}

// save eventInfo which is a EventInfo form
// tested
module.exports.EventInfo.addEventInfo = function(new_EventInfo,callback){
    // check check Existence outside the function
    new_EventInfo.save(callback);
}

// delete eventInfo data specified by username and Eventid
// raw
module.exports.EventInfo.removeEventInfo = function(username,eventid,callback){
    let query = {username:username,eventid:eventid};
    schema.EventInfo.remove(query,callback);
}

// remove all eventInfos given eventid
// raw
module.exports.EventInfo.removeAll_Eventid = function(eventid,callback){
    let query = {eventid:eventid};
    schema.EventInfo.remove(query,callback);
}

// remove all eventsInfos given user name
// raw
module.exports.EventInfo.removeAll_Username = function(username,callback){
    let query = {username:username};
    schema.EventInfo.remove(query,callback);
}

// raw
module.exports.EventInfo.checkPeopleAttend = function(eventid,callback){
    let query = {eventid:eventid};
    schema.EventInfo.find(query,callback);
}

// ================== EVENT  RELATED ========================
// a user post a new event and open for registration
// raw
module.exports.Event.postEvent = function(new_event,callback){
    schema.Event.save(new_event,callback);
}


// a user delete a posted Event from the Event Schema
// raw
module.exports.Event.removeEvent = function(hostname,name,callback){
    let query = {hostname:hostname,name:name};
    schema.Event.remove(name,callback);
}

// a user update a posted Event from the Event Schema
// raw
module.exports.Event.updateEvent = function(old_one,new_one,callback){
    schema.Event.update(old_one,new_one,callback);
}

// load all the events and fill for events.html
module.exports.Event.loadAll = function(callback){
    schema.Event.find({},callback);
}

// checkEventExistence
// raw
module.exports.Event.checkEventExistence = function(hostname,name,callback){
    let query = {hostname:hostname,name:name};
    Schema.Event.findOne(query,callback);
}


// ================== Users  RELATED ========================
module.exports.Users.getAccountById = function(id,callback){
    schema.Users.findById(id,callback);
}

// load all the events and fill for events.html
module.exports.Users.loadAllUsers = function(callback){
    schema.Users.find({},callback);
}



//
