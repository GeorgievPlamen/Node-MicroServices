import { Subjects } from "@gp-tickets/common";
import Publisher from "@gp-tickets/common/build/events/base/base-publisher";
import OrderCancelledEvent from "@gp-tickets/common/build/events/order-cancelled-event";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}