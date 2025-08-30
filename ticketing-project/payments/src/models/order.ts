import mongoose from "mongoose";
import { OrderStatus } from "@gp-tickets/common/build/events/types/order-status";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: OrderStatus,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
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
