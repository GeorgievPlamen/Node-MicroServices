import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { NotFoundError, NotAuthorizedError } from "@gp-tickets/common";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";

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
  res.send(order);
});

export { router as deleteOrdersRouter };
