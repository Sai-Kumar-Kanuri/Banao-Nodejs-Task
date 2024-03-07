import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        passwordResetToken: String,
        passwordResetTokenExpiration: Date,
    },
    { timestamps: true }
)

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiration = Date.now() + 10 * 60 * 1000;

    // console.log(resetToken, this.passwordResetToken);

    return resetToken;

}

const User = mongoose.model("User", userSchema);

export default User;