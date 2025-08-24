import Publisher from "./base-publisher";
import TicketCreatedEvent from "./ticket-created-event";

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  async publish(data: {
    id: string;
    title: string;
    price: number;
  }): Promise<void> {}
}
