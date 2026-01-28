import { Schema, model } from 'mongoose';

const TableSchema = new Schema({
  number: { type: Number, required: true },
  capacity: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  // Optional: allow shared tables across restaurants
  restaurantId: { type: String, required: false },
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

export const Table = model('Table', TableSchema);
