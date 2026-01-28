import { Schema, model } from 'mongoose';

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  categoryId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'], default: 'mild' },
  preparationTime: { type: Number }
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

export const MenuItem = model('MenuItem', MenuItemSchema);
