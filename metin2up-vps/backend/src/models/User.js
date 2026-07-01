const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Kullanıcı adı gerekli'],
      unique: true,
      trim: true,
      minlength: [3, 'Kullanıcı adı en az 3 karakter olmalı'],
      maxlength: [24, 'Kullanıcı adı en fazla 24 karakter olabilir'],
      match: [/^[a-zA-Z0-9_.-]+$/, 'Sadece harf, rakam, _ . - karakterleri'],
    },
    email: {
      type: String,
      required: [true, 'E-posta gerekli'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Geçersiz e-posta formatı'],
    },
    password_hash: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    post_count: { type: Number, default: 0, index: true },
    verified: { type: Boolean, default: false, index: true },
    is_admin: { type: Boolean, default: false, index: true },
    is_seed: { type: Boolean, default: false },
    is_banned: { type: Boolean, default: false },
    last_login_at: { type: Date },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

userSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password_hash;
    return ret;
  },
});

userSchema.methods.setPassword = async function (plain) {
  this.password_hash = await bcrypt.hash(plain, 12);
};

userSchema.methods.verifyPassword = async function (plain) {
  if (!this.password_hash) {
    const fresh = await this.constructor.findById(this._id).select('+password_hash');
    if (!fresh || !fresh.password_hash) return false;
    return bcrypt.compare(plain, fresh.password_hash);
  }
  return bcrypt.compare(plain, this.password_hash);
};

module.exports = mongoose.model('User', userSchema);
