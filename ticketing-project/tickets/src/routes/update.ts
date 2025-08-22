import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@gp-tickets/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .not()
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater then 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;
    ticket.title = title;
    ticket.price = price;

    console.log(
      `Updating a ticket:\n  title:${ticket.title}\n price:${ticket.price}\n userId: ${ticket.userId}`
    );

    await ticket.save();

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
