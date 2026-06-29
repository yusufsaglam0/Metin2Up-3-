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
    passwordHash: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    postCount: { type: Number, default: 0, index: true },
    verified: { type: Boolean, default: false, index: true },
    isAdmin: { type: Boolean, default: false, index: true },
    isBanned: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.virtual('id').get(function () { return this._id.toString(); });
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

userSchema.methods.verifyPassword = async function (plain) {
  if (!this.passwordHash) {
    // Need to refetch with passwordHash since it's select:false
    const fresh = await this.constructor.findById(this._id).select('+passwordHash');
    if (!fresh || !fresh.passwordHash) return false;
    return bcrypt.compare(plain, fresh.passwordHash);
  }
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
