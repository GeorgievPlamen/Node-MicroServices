import { NotFoundError, Subjects } from "@gp-tickets/common";
import Listener from "@gp-tickets/common/build/events/base/base-listener";
import TicketUpdatedEvent from "@gp-tickets/common/build/events/ticket-updated-event";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = "orders-service";

  async onMessage(
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    },
    msg: Message
  ) {
    const { title, price } = data;
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.title = title;
    ticket.price = price;
    await ticket.save();

    msg.ack();
  }
}
