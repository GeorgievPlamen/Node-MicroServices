import { Subjects } from "./subjects";

export default interface OrderCancelledEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
