- Name of team members:<br />
  Ying Jhu Wang<br/>
  Bingzhao Sahn<br/>
  Guanxiong Liu<br/>
  Bin Liu<br/>



# ------------  Front End Functionality:  ------------


## Home:
### A home page with information about us

## Signup:
### Membership Registration
## Login:
### Log in with registered username and password
## Events:
### Events hold by the UTRoadTrippers club with an image and brief description.
## Profile page:
###
###     Message: message section shows all the message get from admin
###     Profile: profile allows user make change to their profile
###     Password: user can reset password here
###     Event: event page shows all the events user attended, user can also cancel their events here
## Map:
### You will see the event's name and description on the left, and a map on the right to show the route from departure location to destination.You can get the description of the trip on a specific day by clicking the date on title.You can switch the sign on the top of map to shows the restaurant, shopping palace and coffee shop near this trip.






# ------------  Features for Users from terminal  ------------

## 1.User Registration:

    curl -d '{"username":"1234","firstName":"firstName","lastName":"lastName","email": "email@gmail.com","phone": "1234567890","activationToken":"password"}' -H "Content-Type: application/json" -X POST http://utroadtrippers.com/api/registration

## 2.User LogIn AUTHORIZATION:

    curl -d '{"username":"1234","password":"password"}' -H "Content-Type: application/json" -X POST http://utroadtrippers.com/api/authenticate

## 3.USER CHANGE PROFILE
after we logged in, we get the data of the user in the response:

    "user":{

     "id":"5a24cf256c804badfeefb992",

     "firstName":"firstName",

     "lastName":"lastName",

     "username":"1234",

     "email":"email@gmail.com",

     "phone":1234567890,

     "permission":0,

     "activated":false

     }

### to update his profile, for example firstName:

    curl -d '{"firstName":"newFirstName","lastName":"lastName","username":"1234","email":"email@gmail.com","phone":1234567890,"permission":0,"activated":false}' -H "Content-Type: application/json" -X PUT http://utroadtrippers.com/api/change/profile

### to change the password:
    curl -d '{"user":{"firstName":"newFirstName","lastName":"lastName","username":"1234","email":"email@gmail.com","phone":1234567890,"permission":0,"activated":false},"newpass":"newpassword"}' -H "Content-Type: application/json" -X PUT http://utroadtrippers.com/api/change/password

## 5.GET EVENTS:

    curl -X GET http://utroadtrippers.com/api/events

## 6.USER JOIN EVENT:

after we get the id of the event from previous step, we are now able to join events:

    eventInfo:{

    "eventid":"5a239890c33414941f4efc7b",

    "name"   :"Toronto",

    "username":"1234",

    "ifVehicle":"false"

    }

Then post to the end point

    curl -d '{"eventid":"5a239890c33414941f4efc7b","name"   :"Toronto","username":"1234","ifVehicle":"false"}' -H "Content-Type: application/json" -X POST http://utroadtrippers.com/api/join/event

## 7.GET EVENT INFORMATION OF A USER

    curl -X GET http://utroadtrippers.com/api/quit/event/username

    e.g:
    curl -X GET http://utroadtrippers.com/api/eventinfo/1234

## 8.USER QUIT EVENT

    curl -X DELETE http://utroadtrippers.com/api/quit/event/username/eventid

    e.g :
    curl -X DELETE http://utroadtrippers.com/api/quit/event/1234/5a239890c33414941f4efc7b

## 9. GET USER BY USER NAME ********* ONLY USED FOR TESTING ***********

    curl -X GET http://utroadtrippers.com/api/user/username

    e.g:
    curl -X GET http://utroadtrippers.com/api/user/1234
    
## 10. POST MESSAGES TO ALL USERS

    curl -d '{"message":"This is MY message!!!","message_id"   :"xxx"}' -H "Content-Type: application/json" -X POST http://utroadtrippers.com/api/messages
