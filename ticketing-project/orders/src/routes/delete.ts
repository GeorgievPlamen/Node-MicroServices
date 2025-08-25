import express, { Response } from "express";

const router = express.Router();

router.delete("/api/orders/:orderId", async (_, res: Response) => {
  res.send({});
});

export { router as deleteOrdersRouter };
