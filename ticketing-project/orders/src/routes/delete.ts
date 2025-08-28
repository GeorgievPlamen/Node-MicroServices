import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { NotFoundError, NotAuthorizedError } from "@gp-tickets/common";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();
  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id
    },
  });

  res.send(order);
});

export { router as deleteOrdersRouter };
