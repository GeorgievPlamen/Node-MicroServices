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
import PaymentCreatedPublisher from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    });
    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      // @ts-ignore
      id: payment._id,
      chargeId: payment.stripeId,
      stripeId: payment.orderId,
    });

    res.send({ success: true, payment: payment });
  }
);

export { router as createChargeRouter };
