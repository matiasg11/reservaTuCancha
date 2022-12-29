const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //Middleware function that we call later
const { buildSchema } = require('graphql');
const mongoose = require('mongoose')

const app = express();

const events = [];

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

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `), //point to a valid graphql schema
    //Has all the resolver functions. Need to match the schema endpoints by name
    rootValue: {
        events: () =>{
            return events;
        },

        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price, 
                date: args.eventInput.date
            }
            events.push(event)
            return event
        }
    },
    graphiql: true

}));


app.get('/', (req,res,next)=>{
    res.send(`Listening on port...${PORT}`)
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@rtc.mhdv1hi.mongodb.net/test`)
    .then().catch(err=>{
        console.log(err)
});

let PORT = 3000
app.listen(PORT);
 