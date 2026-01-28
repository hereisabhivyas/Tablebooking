import { Schema, model } from 'mongoose';

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  cuisine: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  image: { type: String },
  isOpen: { type: Boolean, default: true },
  openTime: { type: String },
  closeTime: { type: String },
  address: { type: String },
  contactEmail: { type: String, required: true, unique: true },
  contactPhone: { type: String },
  // Simple auth field: store password hash
  passwordHash: { type: String },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      const transformed: any = ret;
      transformed.id = transformed._id.toString();
      // Do not expose password hash
      delete transformed.passwordHash;
      delete transformed._id;
    },
  },
});

export const Restaurant = model('Restaurant', RestaurantSchema);
