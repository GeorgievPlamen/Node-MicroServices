import express, { Response } from "express";

const router = express.Router();

router.post("/api/orders/", async (_, res: Response) => {
  res.send({});
});

export { router as newOrdersRouter };
