import express, { Response } from "express";

const router = express.Router();

router.get("/api/orders/orderId:", async (_, res: Response) => {
  res.send({});
});

export { router as showOrdersRouter };
