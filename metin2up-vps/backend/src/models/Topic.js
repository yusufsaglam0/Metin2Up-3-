const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    subforum_slug: { type: String, required: true, index: true, lowercase: true, trim: true },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Başlık en az 3 karakter olmalı'],
      maxlength: [200, 'Başlık en fazla 200 karakter olabilir'],
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, 'İçerik boş olamaz'],
      maxlength: [10000, 'İçerik en fazla 10000 karakter olabilir'],
    },
    author: { type: String, required: true, index: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    is_vip: { type: Boolean, default: false, index: true },
    is_new: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    is_pinned: { type: Boolean, default: false, index: true },
    is_locked: { type: Boolean, default: false },
    replies_count: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    last_reply_at: { type: Date },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

topicSchema.index({ subforum_slug: 1, is_pinned: -1, updated_at: -1 });
topicSchema.index({ title: 'text', content: 'text' });

topicSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Topic', topicSchema);
