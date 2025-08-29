import { Subjects } from "@gp-tickets/common";
import Listener from "@gp-tickets/common/build/events/base/base-listener";
import { Message } from "node-nats-streaming";
import OrderCreatedEvent from "@gp-tickets/common/build/events/order-created-event";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: {
      id: string;
      version: number;
      status: OrderStatus;
      userId: string;
      expiresAt: string;
      ticket: { id: string; price: number };
    },
    msg: Message
  ) {
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
