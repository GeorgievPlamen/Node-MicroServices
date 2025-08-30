import { Subjects } from "@gp-tickets/common";
import Publisher from "@gp-tickets/common/build/events/base/base-publisher";
import PaymentCreatedEvent from "@gp-tickets/common/build/events/payment-created-event";

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
