import nats, { Message } from "node-nats-streaming";
// @ts-ignore
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

// @ts-ignore
stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // @ts-ignore
  stan.on("close", () => {
    console.log("NATS connection closed!");
    // @ts-ignore
    process.exitCode();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-service");

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  // @ts-ignore
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()} {\n${data}\n}\n`);
    }

    msg.ack();
  });
});

// @ts-ignore
process.on("SIGINT", () => stan.close());
// @ts-ignore
process.on("SIGTERM", () => stan.close());
