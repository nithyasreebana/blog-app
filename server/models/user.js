const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/image.png",
    },
    role: {
      type: String,
      enum: ["user", "admin", "USER", "ADMIN"],
      default: "user",
      set: (v) => (v ? v.toLowerCase() : "user"),
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "blog",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method with backward-compatibility for legacy HMAC SHA-256
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.password && this.password.startsWith("$2")) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  // Fallback for legacy records hashed with crypto.createHmac
  if (this.salt) {
    const crypto = require("crypto");
    const userProvidedHash = crypto
      .createHmac("sha256", this.salt)
      .update(enteredPassword)
      .digest("hex");
    if (this.password === userProvidedHash) {
      // Re-hash with bcrypt for future logins
      this.password = enteredPassword;
      this.salt = undefined;
      await this.save();
      return true;
    }
  }
  return false;
};

// Remove sensitive fields from JSON serialization
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.salt;
  return userObject;
};

const User = model("user", userSchema);
module.exports = User;