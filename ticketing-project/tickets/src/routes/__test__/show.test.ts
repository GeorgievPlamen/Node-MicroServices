import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get("/api/tickets/" + id)
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "test", price: 20 })
    .expect(201);

  const { id } = response.body;

  await request(app)
    .get("/api/tickets/" + id)
    .send()
    .expect(200);
});
