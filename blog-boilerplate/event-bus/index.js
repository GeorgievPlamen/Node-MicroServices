import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);

    console.log("Posting event: ", event);
    axios.post("http://localhost:4000/events", event).catch(e => console.log(e.message));
    axios.post("http://localhost:4001/events", event).catch(e => console.log(e.message));
    axios.post("http://localhost:4002/events", event).catch(e => console.log(e.message));
    axios.post("http://localhost:4003/events", event).catch(e => console.log(e.message));

    res.send({ status: "OK" });
})

app.get("/events", (_, res) => res.send(events));

app.listen(4005, () => console.log("Listening on 4005."));