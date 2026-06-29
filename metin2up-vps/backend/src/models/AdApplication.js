const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    contact: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    adType: { type: String, default: 'banner', enum: ['banner', 'vip', 'side', 'other'] },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'], index: true },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

adSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('AdApplication', adSchema);
