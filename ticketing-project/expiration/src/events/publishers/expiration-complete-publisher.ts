import { Subjects } from "@gp-tickets/common";
import Publisher from "@gp-tickets/common/build/events/base/base-publisher";
import ExpirationCompleteEvent from "@gp-tickets/common/build/events/expiration-complete-event";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
