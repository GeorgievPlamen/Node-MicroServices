import { requireAuth, validateRequest } from "@gp-tickets/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";

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

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
