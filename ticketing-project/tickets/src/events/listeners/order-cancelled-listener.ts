import { Subjects } from "@gp-tickets/common";
import Listener from "@gp-tickets/common/build/events/base/base-listener";
import { Message } from "node-nats-streaming";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";
import OrderCancelledEvent from "@gp-tickets/common/build/events/order-cancelled-event";

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
    const ticket = await Ticket.findById(data.ticket.id);
    ticket?.set({ orderId: undefined });
    await ticket?.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket?.id,
      orderId: ticket?.orderId ?? "",
      price: ticket?.price ?? 0,
      title: ticket?.title ?? "",
      userId: ticket?.userId ?? "",
      version: ticket?.version ?? 0,
    });

    msg.ack();
  }
}
