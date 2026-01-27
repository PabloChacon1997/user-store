import mongoose, { Schema } from "mongoose";



const categorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }

});

categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret, options) {
    const r = ret as any;
    if (r && r._id) {
      r.id = r._id;
      delete r._id;
    }
    return r;
  },
});

export const CategoryModel = mongoose.model('Category', categorySchema);