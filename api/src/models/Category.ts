import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String },
  image: { type: String },
  restaurantId: { type: String, required: true },
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

export const Category = model('Category', CategorySchema);
