import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@gp-tickets/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Token is required"),
    body("orderId").not().isEmpty().withMessage("Order id is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order is cancelled!");
    }

    const charge = await stripe.charges.create({
      currency: "eur",
      amount: order.price * 100, // convert to cents
      source: token,
    });

    await Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    }).save();

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
