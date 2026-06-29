const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    minPosts: { type: Number, required: true, default: 0, index: true },
    color: { type: String, default: '#6b7280' },
    icon: { type: String, default: 'user' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

rankSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Rank', rankSchema);
