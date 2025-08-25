import express, { Response } from "express";

const router = express.Router();

router.get("/api/orders/", async (_, res: Response) => {
  res.send({});
});

export { router as indexOrdersRouter };
