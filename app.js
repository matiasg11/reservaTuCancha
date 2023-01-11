const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //Middleware function that we call later
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express();

app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
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
 