import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (_, res) => res.send(posts));

app.post("/events", (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
})

app.listen(4002, async () => {
    console.log("Listening on 4002");
    const res = await axios.get('http://localhost:4005/events');

    for (let event of res.data) {
        console.log("Processing event: ", event);
        handleEvent(event.type, event.data);
    }
})

function handleEvent(type, data) {
    console.log(`Received: ${type} \n\n ${data}\n`)

    if (type === "PostCreated") {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === "CommentCreated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];

        post.comments.push({ id, content, status });

    }

    if (type === "CommentUpdated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(c => c.id === id);

        comment.content = content;
        comment.status = status;
    }
}