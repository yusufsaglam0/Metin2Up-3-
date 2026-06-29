const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    subForumSlug: { type: String, required: true, index: true, lowercase: true, trim: true },
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
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isVip: { type: Boolean, default: false, index: true },
    isNew: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false, index: true },
    isLocked: { type: Boolean, default: false },
    repliesCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    lastReplyAt: { type: Date },
  },
  { timestamps: true }
);

topicSchema.index({ subForumSlug: 1, isPinned: -1, updatedAt: -1 });
topicSchema.index({ title: 'text', content: 'text' });

topicSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Topic', topicSchema);
