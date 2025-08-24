import nats, { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
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

abstract class Listener {
  private readonly client: Stan;
  protected ackWait = 5 * 1000;

  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions(): SubscriptionOptions {
    return this.subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `\nMessage received: ${this.subject} / ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
