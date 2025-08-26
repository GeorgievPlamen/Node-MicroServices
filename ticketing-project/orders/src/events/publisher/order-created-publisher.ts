import { Subjects } from "@gp-tickets/common";
import Publisher from "@gp-tickets/common/build/events/base/base-publisher";
import OrderCreatedEvent from "@gp-tickets/common/build/events/order-created-event";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
