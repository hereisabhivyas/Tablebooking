import { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  notes: { type: String, default: null },
}, { _id: false });

const OrderSchema = new Schema({
  restaurantId: { type: String, required: true },
  tableNumber: { type: Number, required: true, min: 1 },
  items: {
    type: [OrderItemSchema],
    validate: {
      validator: (v: any[]) => Array.isArray(v) && v.length > 0,
      message: 'Order must have at least one item'
    }
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'placed',
  },
  totalAmount: { type: Number, required: true },
  notes: { type: String, default: null },
  rejectionReason: { type: String, default: null },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      const transformed: any = ret;
      transformed.id = transformed._id.toString();
      delete transformed._id;
    },
  },
});

export const Order = model('Order', OrderSchema);
