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

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput{
            email: String!
            password: String!
        }

        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `), //point to a valid graphql schema
    //Has all the resolver functions. Need to match the schema endpoints by name
    rootValue: {
        events: () =>{
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return {...event._doc, _id: event._doc._id.toString()}
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
                date: new Date (args.eventInput.date)
            })
            return event
                .save()
                .then(result => {
                    console.log(result);
                    return {...result._doc, _id: result._doc._id.toString()};
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
 