const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    date: Date,
    sport: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    toJSON: {
        virtuals: true
    }
});

EventSchema.virtual('thumbnail_url').get(function(){
    // return `http://localhost:8000/files/${this.thumbnail}`;
    return this.thumbnail;
});

module.exports = mongoose.model('Event', EventSchema);