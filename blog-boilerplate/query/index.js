import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (_, res) => res.send(posts));

app.post("/events", (req, res) => {
    const { type, data } = req.body;

    console.log(`Received: ${type} \n\n ${data}\n`)

    if (type === "PostCreated") {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === "CommentCreated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];

        post.comments.push({ id, content, status });

        res.send({});
    }

    if (type === "CommentUpdated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(c => c.id === id);

        console.log(data);

        console.log(content);
        console.log(status);

        comment.content = content;
        comment.status = status;

        console.log(comment);
        console.log(posts);
        res.send({});
    }

    console.log(posts);
})

app.listen(4002, () => console.log("Listening on 4002"))