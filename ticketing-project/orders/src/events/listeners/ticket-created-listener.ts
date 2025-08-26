import { Subjects } from "@gp-tickets/common";
import Listener from "@gp-tickets/common/build/events/base/base-listener";
import TicketCreatedEvent from "@gp-tickets/common/build/events/ticket-created-event";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "orders-service";

  async onMessage(
    data: { id: string; title: string; price: number; userId: string },
    msg: Message
  ) {
    const { title, price, id } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
