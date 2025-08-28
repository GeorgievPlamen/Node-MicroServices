import { Stan } from "node-nats-streaming";
import { Subjects } from "../subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export default abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  protected readonly client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  // @ts-expect-error
  publish(data: T["data"]): Promise<void> {
    this.client.publish(this.subject, JSON.stringify(data), (err) => {
      return new Promise((resolve, reject) => {
        if (err) {
          return reject(err);
        }

        console.log("Event published to subject", this.subject);
        resolve(null);
      });
    });
  }
}
