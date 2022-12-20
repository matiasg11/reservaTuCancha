const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //Middleware function that we call later
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type RootQuery{
            events: [String!]!
        }

        type RootMutation{
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `), //point to a valid graphql schema
    //Has all the resolver functions. Need to match the schema endpoints by name
    rootValue: {
        events: () =>{
            return ['Romantic Cooking', 'Sailing', 'Football'];
        },

        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true

}));


app.get('/', (req,res,next)=>{
    res.send(`Listening on port...${PORT}`)
})

let PORT = 3000
app.listen(PORT);
