const bcrypt = require('bcryptjs')

const Event = require('../../models/event.js')
const User = require('../../models/user.js')


const events = async eventIds => {
    try{
        const events = await Event.find({ _id: {$in: eventIds}})
          events.map(event =>{
                return {
                    ...event._doc,
                    _id: event.id,
                    date:  new Date(even._doc.date).toISOString(),
                    creator: user.bind(this, event.creator),
                };
            });
            // return events
        } catch(err) {
            throw err;
        }
}


const user = async userId => {
    try{ 
        const user = await User.findById(userId)
            return {
                    ...user._doc,
                    _id: user.id,
                    createdEvents: events.bind(this, user._doc.createdEvents)
            }
            
        } catch (err) {
            throw err
        }
}

module.exports = {
    events: async () => {
        try {
        const events = await Event.find()
            return events
                .map(event => {
                    return {...event._doc,
                             _id: event._doc._id.toString(),
                             date:  new Date(even._doc.date).toISOString(),
                            creator: user.bind(this, event._doc.creator) 
                        }
                })
            }
            catch(err) {
                throw err
            }
    },

    createEvent: async (args) => {
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
        try{
        const result = await event
            .save()
            createdEvent = {
                ...result._doc, 
                _id: result._doc._id.toString(),
                date: new Date (args.eventInput.date),
                creator: user.bind(this, result._doc.creator)
            };
            const u = await User.findById('63b748d157864be987e14092') 
            if (!u){
                throw new Error('User does not exist')
            }
            u.createdEvents.push(event);
            await user.save()
            return createdEvent
        }
            catch(err) {
                console.log(err);
                throw err;
            };
    },


    createUser: async (args) => {
        try{
        const existingUser = await User.findOne({email:args.userInput.email});
                if (existingUser){
                    throw new Error('User exists already');
                }
                const hashPass = await  bcrypt.hash(args.userInput.password, 12);
                const user = new User({
                        email: args.userInput.email,
                        password: hashPass
                    });
                const result = await user.save();
                return { ...result._doc, password:null, _id: result.id};
        }
        catch(err) {
            throw err;
        }
    }
}