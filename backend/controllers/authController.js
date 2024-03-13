import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenandSetCookie from "../utils/generateToken.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";

export const SignUp = async (req, res) => {

    try {
        const { email, username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don' match" })
        }

        const user = await User.findOne({ username });
        
        if (user) {
            return res.status(200).json({ error: "User already Exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            email,
            username,
            password: hashedPassword,
        })

        if (newUser) {
            generateTokenandSetCookie(newUser._id, res)

            newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
            });
        } else {
            res.status(400).json({ error: "Invalid User Data" })
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const Login = async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenandSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const Logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const ForgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User doen't exists" });
        }

        const resetToken = user.createResetPasswordToken();

        // console.log(resetToken);

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
        const message = `We have received a password reset request. Please use the below link to reset your password \n\n\n ${resetUrl}`


        await sendEmail({
            email: user.email,
            subject: 'Password change request recieved',
            message: message
        });

        res.status(200).json({
            status: "success",
            message: "password reset link sent to the user email"
        })
    } catch (error) {
        console.log("Error in ForgotPassword controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });

    }
}


export const ResetPassword = async (req, res) => {
    try {

        const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpiration: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ error: "Token is Invalid or has expired" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiration = undefined;


        if (user) {
            generateTokenandSetCookie(user._id, res)

            user.save();

            res.status(201).json({
                _id: user._id,
                email: user.email,
                username: user.username,
            });
        } else {
            res.status(400).json({ error: "Invalid User Data" })
        }

    } catch (error) {

        console.log("Error in reset-password controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}