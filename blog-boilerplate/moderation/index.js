import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
    console.log("Received Event: ", req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        console.log(status);

        try {
            await axios.post("http://localhost:4005/events", {
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    status: status,
                    content: data.content
                }
            })
        } catch (error) {
            console.log(error);
        }

    }

    res.send({});
})

app.listen(4003, () => {
    console.log("Listening on 4003.");
});