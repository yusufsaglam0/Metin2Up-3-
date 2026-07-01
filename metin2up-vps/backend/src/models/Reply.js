const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    author: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    verified: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

replySchema.index({ topic_id: 1, created_at: 1 });

replySchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Reply', replySchema);
