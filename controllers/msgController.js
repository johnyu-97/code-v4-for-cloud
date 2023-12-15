const msgModel = require("../models/msgModel")


//create Msg
//find Msg


const createMsg = async (req, res) => {
    const { chatId, senderId, text } = req.body
    const message = new msgModel({
        chatId, senderId, text
    })
    try {
        const response = await message.save();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getMsg = async (req, res) => {
    const { chatId } = req.params;
    try {
        const message = await msgModel.find({
            chatId
        });
        return res.status(200).json(message);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
} 

module.exports = { createMsg, getMsg }
