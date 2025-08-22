import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put("/api/tickets/" + id)
    .set("Cookie", global.signin())
    .send({
      title: "asdf",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put("/api/tickets/" + id)
    .send({
      title: "asdf",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "test", price: 20 })
    .expect(201);

  await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", global.signin())
    .send({
      title: "asdf",
      price: 22,
    })
    .expect(401);
});

it("returns a 400 if the users provied invalid input", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 20 })
    .expect(201);

  await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -22,
    })
    .expect(400);
});

it("updated the ticket if input is valid", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 20 })
    .expect(201);

  await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      title: "asdf",
      price: 22,
    })
    .expect(200);
});
