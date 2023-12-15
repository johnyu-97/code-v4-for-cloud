const mongoose = require("mongoose")
const msgSchema = new mongoose.Schema({
    chatId: {
        type: String, 
    },
    senderId: {
        type: String, 
    },
    text: {
        type: String, 
    },

},{
    timestamps:true,
})

const msgModel = mongoose.model("Message", msgSchema)
module.exports = msgModel;
