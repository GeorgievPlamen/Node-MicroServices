import { Subjects } from "@gp-tickets/common";
import Listener from "@gp-tickets/common/build/events/base/base-listener";
import { Message } from "node-nats-streaming";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";
import OrderCancelledEvent from "@gp-tickets/common/build/events/order-cancelled-event";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
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
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
