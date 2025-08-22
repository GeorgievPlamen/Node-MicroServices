import request from "supertest";
import { app } from "../../app";

it("can fetch a list of tickets", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "test", price: 20 })
    .expect(201);

  await request(app).get("/api/tickets/").send().expect(200);
});
