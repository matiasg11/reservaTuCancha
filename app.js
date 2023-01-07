const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //Middleware function that we call later
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const Event = require('./models/event.js')
const User = require('./models/user.js')


const app = express();

app.use(bodyParser.json())

const events = eventIds =>{
    return Event.find({ _id: {$in: eventIds}})
        .then(events => {
            return events.map(event =>{
                return {
                    ...event._doc,
                    _id: event.id,
                    creator: user.bind(this, event.creator)
                }
            })
        })
        .catch(err =>{
            throw err;
        })
}


const user = userId => {
    return User.findById(userId)
        .then(user =>{
            return {
                ...user._doc,
                 _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)}
        })
        .catch(err =>{
            throw err
        })
}




app.use('/graphql', graphqlHTTP({
   
    rootValue: {
        events: () =>{
            return Event.find()
                .populate('creator')
                .then(events => {
                    return events.map(event => {
                        return {...event._doc,
                                 _id: event._doc._id.toString(),
                                creator: user.bind(this, event._doc.creator) 
                            }
                    })
                })
                .catch(err => {throw err})
        },

        createEvent: (args) => {
            // const event = {
            //     _id: Math.random().toString(),
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price, 
            //     date: args.eventInput.date
            // }

            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price, 
                date: new Date (args.eventInput.date),
                creator: '63b748d157864be987e14092'
            })
            let createdEvent
            return event
                .save()
                .then(result => {
                    createdEvent = {...result._doc, 
                                    _id: result._doc._id.toString(),
                                    creator: user.bind(this, result._doc.creator)};
                    return User.findById('63b748d157864be987e14092')
                    console.log(result);
                   
                })
                .then(user =>{
                    if (!user){
                        throw new Error('User does not exist')
                   }
                   user.createdEvents.push(event);
                   return user.save()
                })
                .then(result => {
                    return createdEvent
                })
                .catch(err =>{
                    console.log(err);
                    throw err;
                });
        },


        createUser: args => {
        return User.findOne({email:args.userInput.email})
            .then(user =>{ 
                 if (user){
                      throw new Error('User exists already')
                 }
                 return bcrypt.hash(args.userInput.password, 12)})
                .then(hashPass =>{
                    const user = new User({
                        email: args.userInput.email,
                        password: hashPass
                    });
                    return user.save();
                })
                .then(result => {
                    return { ...result._doc, password:null, _id: result.id};
                })
                .catch(err =>{
                throw err;
                });
        }
    },
    graphiql: true

}));


app.get('/', (req,res,next)=>{
    res.send(`Listening on port...${PORT}`)
})

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@rtc.mhdv1hi.mongodb.net/${process.env.MONGO_DB}`)
    .then().catch(err=>{
        console.log(err)
});

let PORT = 3000
app.listen(PORT);
 