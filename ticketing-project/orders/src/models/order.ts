import mongoose from "mongoose";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: OrderStatus,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
});

orderSchema.methods.toJSON = function () {
  const { __v, password, _id, ...order } = this.toObject();
  order.id = _id;
  return order;
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
