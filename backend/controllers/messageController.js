import Conversation from "../model/conversationModel.js";
import Message from "../model/messageModel.js";


export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        // const receiverId = req.params.id;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });


        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }


        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        console.log(receiverId);
        console.log(newMessage);

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await conversation.save();
        // await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()]);


        res.status(201).json({ message: "Message Sent Successfully" });

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getMessage = async (req, res) => {


    try {

        // const receiverId = req.params.id;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }

}