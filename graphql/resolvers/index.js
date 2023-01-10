const bcrypt = require('bcryptjs')

const Event = require('../../models/event.js')
const User = require('../../models/user.js')
const Booking = require('../../models/booking.js')


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
const singleEvent = async eventId =>{
    try{
        const event = await Event.findById(eventId);
        return { 
            ...event._doc,
            _id: event.id,
            creator:user.bind(this, event.creator)}
    }
    catch{
        throw err
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
    bookings: async() =>{
        try{
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { 
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                }
            })
        }
        catch{
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
        const result = await event.save()
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
            await u.save()
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
    },
    bookEvent: async (args) => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking( {
            user: "63b748d157864be987e14092",
            event: fetchedEvent
        })
        const result = await booking.save();
        return { ...result._doc, _id: result.id}
    }
}