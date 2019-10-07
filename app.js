const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// Idea services 
class IdeaService{
    constructor(){
        this.ideas = [];
    }
    async find() {
        return this.ideas;
    }

    async create(data) {
        const idea = {
            id: this.ideas.length,
            text: data.text,
            tech: data.tech,
            viewer: data.viewer
        }
        idea.time = moment().format('h:mm:ss a');

        this.ideas.push(idea);

        return idea;
    }
}

const app = express(feathers());

// Parse json 
app.use(express.json());
// Configure socket.io to realtime API 
app.configure(socketio());
// Enable REST service 
app.configure(express.rest());
// register services
app.use('/ideas', new IdeaService());
// new connection connects to stream channel 
app.on('connection', conn => app.channel('stream').join(conn));
// pubblish events to stream channel
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => console.log(`Real Time Server Running On Port ${PORT}`));

// app.service('ideas').create({
//     text: 'Build a cool app',
//     tech: 'Node.js',
//     viewer: 'Ben',
//     time: moment().format('h:mm:ss a')
// })

