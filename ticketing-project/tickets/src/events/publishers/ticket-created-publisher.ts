import { Subjects } from "@gp-tickets/common";
import Publisher from "@gp-tickets/common/build/events/base/base-publisher";
import TicketCreatedEvent from "@gp-tickets/common/build/events/ticket-created-event";

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
