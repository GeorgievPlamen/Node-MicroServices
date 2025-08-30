import { Message } from "node-nats-streaming";
import PaymentCreatedEvent from "@gp-tickets/common/build/events/payment-created-event";
import { NotFoundError, Subjects } from "@gp-tickets/common";
import Listener from "@gp-tickets/common/build/events/base/base-listener";
import { Order } from "../../models/order";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = "orders-service";

  async onMessage(
    data: { id: string; orderId: string; chargeId: string },
    msg: Message
  ) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
