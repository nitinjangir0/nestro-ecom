import UserModel from "../model/user.model.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"
import sendOtpMail from "../utils/sendOtpMail.js";
import Cryptr from "cryptr";
import generateToken from "../utils/generateToken.js";
const cryptr = new Cryptr(process.env.CLOUDINARY_API_SECRET);

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const user = await UserModel.findOne({ email });
        if (user) return sendConflict(res, "User already exists");
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = Date.now() + 3 * 60 * 1000;
        const mailResponse = await sendOtpMail(email, otp);
        console.log(mailResponse, "mailResponse")
        const passwordHash = cryptr.encrypt(password); await UserModel.create({ name, email, password: passwordHash, otp, otpExpire });
        const responseData = {
            user: email,
            success: true,
            message: "User registered successfully. Please check your email for OTP verification."
        };

        if (process.env.NODE_ENV !== "production") {
            responseData.otp = otp;
        }

        return res.status(201).json(responseData);


    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }

}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return sendConflict(res, "User not found");
        if (String(user.otp) !== String(otp)) { return sendConflict(res, "Invalid OTP"); }
        if (Date.now() > user.otpExpire) return sendConflict(res, "OTP expired");
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();
        return sendSuccess(res, "User verified successfully.");
    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }

}

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return sendConflict(res, "User not found");
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = Date.now() + 3 * 60 * 1000;
        const mailReponse = await sendOtpMail(email, otp);
        // console.log(mailReponse, "mailResponse")
        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();
        if (process.env.NODE_ENV !== "production") {
            return res.status(200).json({
                success: true,
                message: "OTP resent successfully.",
                otp
            });
        }

        return sendSuccess(
            res,
            "OTP resent successfully. Please check your email."
        );
    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email ko clean karo
        const cleanEmail = email.trim().toLowerCase();

        const user = await UserModel.findOne({
            email: cleanEmail
        });

        // Account nahi mila
        if (!user) {
            return sendNotFound(
                res,
                "Account not found. Please create an account."
            );
        }

        // Password check
        const decryptedPassword = cryptr.decrypt(
            user.password
        );

        if (decryptedPassword !== password) {
            return sendConflict(
                res,
                "Invalid email or password"
            );
        }

        // Email verification check
        if (!user.isVerified) {
            return sendConflict(
                res,
                "Please verify your email before logging in"
            );
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Send cookie
        res.cookie("jwt", token, {
            maxAge: 900000,
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return sendSuccess(
            res,
            "Login successful",
            {
                user
            }
        );

    } catch (error) {
        console.log(error, "error");

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};



const getProfile = async (req, res) => {
    try {

        const user = await UserModel.findById(req.user._id).select("-password -otp -otpExpire");

        if (!user) {
            return sendConflict(res, "User not found");
        }
        const menu = [
            {
                id: 1,
                title: "My Profile",
                icon: "User",
                href: "/profile"
            },
            {
                id: 2,
                title: "My Orders",
                icon: "ShoppingBag",
                href: "/orders"
            },
            {
                id: 3,
                title: "Wishlist",
                icon: "Heart",
                href: "/wishlist"
            },
            {
                id: 4,
                title: "Address",
                icon: "MapPin",
                href: "/address"
            },
            {
                id: 5,
                title: "Change Password",
                icon: "Lock",
                href: "/change-password"
            },
            {
                id: 6,
                title: "Logout",
                icon: "LogOut",
                href: "/logout"
            }
        ];

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user,
            menu
        });

    } catch (error) {
        console.log(error);
        sendServerError(res, "Internal Server Error");
    }
};

export const checkout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Checkout page"
        });
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};


const addAddress = async (req, res) => {
    try {

        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Sirf ek default address
        if (req.body.isDefault) {
            user.addresses.forEach((item) => {
                item.isDefault = false;
            });
        }

        user.addresses.push(req.body);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Address added successfully",
            addresses: user.addresses
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



const updateAddress = async (req, res) => {
    try {

        const { addressId } = req.params;

        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Agar ye default ban raha hai to purane default hata do
        if (req.body.isDefault) {
            user.addresses.forEach((item) => {
                item.isDefault = false;
            });
        }

        address.fullname = req.body.fullname;
        address.mobile = req.body.mobile;
        address.pincode = req.body.pincode;
        address.addressLine = req.body.addressLine;
        address.city = req.body.city;
        address.state = req.body.state;
        address.country = req.body.country;
        address.isDefault = req.body.isDefault;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            addresses: user.addresses
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



const deleteAddress = async (req, res) => {

    try {

        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }


        user.addresses = user.addresses.filter(
            item => item._id.toString() !== req.params.id
        );


        await user.save();


        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.addresses
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}



const changeDefaultAddress = async (req, res) => {

    try {

        const { addressId } = req.params;

        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.addresses.forEach((item) => {
            item.isDefault = item._id.toString() === addressId;
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Default address updated",
            addresses: user.addresses
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const makeDefaultAddress = async (req, res) => {
    try {

        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        user.addresses.forEach((item) => {
            item.isDefault = false;
        });


        const address = user.addresses.id(req.params.id);


        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }


        address.isDefault = true;


        await user.save();


        return res.status(200).json({
            success: true,
            message: "Default address updated",
            addresses: user.addresses
        });



    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}



const forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;

        if (!email) {
            return sendBadRequest(res, "Email is required");
        }

        // Email clean + lowercase
        email = email.trim().toLowerCase();

        console.log("FORGOT PASSWORD EMAIL:", email);

        const user = await UserModel.findOne({ email });

        if (!user) {
            return sendNotFound(
                res,
                "User with this email not found"
            );
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        );

        // OTP valid for 3 minutes
        const otpExpire = Date.now() + 3 * 60 * 1000;

        await sendOtpMail(email, otp);

        user.otp = otp;
        user.otpExpire = otpExpire;

        await user.save();

        return sendSuccess(
            res,
            "OTP sent successfully. Please check your email."
        );

    } catch (error) {
        console.log(
            "FORGOT PASSWORD ERROR:",
            error
        );

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};


// VERIFY FORGOT PASSWORD OTP
const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return sendBadRequest(res, "Email and OTP are required");
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return sendNotFound(res, "User with this email not found");
        }

        if (!user.otp || !user.otpExpire) {
            return sendConflict(res, "OTP not found. Please request a new OTP");
        }

        if (Date.now() > user.otpExpire) {
            user.otp = undefined;
            user.otpExpire = undefined;

            await user.save();

            return sendConflict(res, "OTP expired");
        }

        if (String(user.otp) !== String(otp)) {
            return sendConflict(res, "Invalid OTP");
        }

        return sendSuccess(
            res,
            "OTP verified successfully. You can reset your password now."
        );

    } catch (error) {
        console.log(error, "verifyForgotPasswordOtp error");

        return sendServerError(res, "Internal Server Error");
    }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            password,
            confirmPassword
        } = req.body;

        if (!email || !otp || !password || !confirmPassword) {
            return sendBadRequest(
                res,
                "Email, OTP, password and confirm password are required"
            );
        }

        if (password !== confirmPassword) {
            return sendBadRequest(
                res,
                "Password and confirm password do not match"
            );
        }

        if (password.length < 6) {
            return sendBadRequest(
                res,
                "Password must be at least 6 characters"
            );
        }

        const user = await UserModel.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return sendNotFound(
                res,
                "User with this email not found"
            );
        }

        if (!user.otp || !user.otpExpire) {
            return sendConflict(
                res,
                "OTP not found. Please request a new OTP"
            );
        }

        if (Date.now() > user.otpExpire) {
            user.otp = undefined;
            user.otpExpire = undefined;

            await user.save();

            return sendConflict(
                res,
                "OTP expired"
            );
        }

        if (String(user.otp) !== String(otp)) {
            return sendConflict(
                res,
                "Invalid OTP"
            );
        }

        // =========================
        // UPDATE PASSWORD
        // =========================

        user.password = cryptr.encrypt(password);

        // OTP consume
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        // =========================
        // AUTO LOGIN
        // =========================

        const token = generateToken(user._id);

        res.cookie("jwt", token, {
            maxAge: 900000,
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return sendSuccess(
            res,
            "Password reset successfully. You are now logged in.",
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role
                }
            }
        );

    } catch (error) {
        console.log("RESET PASSWORD ERROR:", error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};



const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            password,
            confirmPassword
        } = req.body;

        console.log("CHANGE PASSWORD BODY:", req.body);
        console.log("CHANGE PASSWORD USER:", req.user);

        if (!currentPassword || !password || !confirmPassword) {
            return sendBadRequest(
                res,
                "All password fields are required"
            );
        }

        if (password.length < 6) {
            return sendBadRequest(
                res,
                "New password must be at least 6 characters"
            );
        }

        if (password !== confirmPassword) {
            return sendBadRequest(
                res,
                "New passwords do not match"
            );
        }

        if (currentPassword === password) {
            return sendBadRequest(
                res,
                "New password must be different from current password"
            );
        }

        // protect middleware se user mil raha hai
        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return sendNotFound(
                res,
                "User not found"
            );
        }

        // Existing encrypted password decrypt
        let oldPassword;

        try {
            oldPassword = cryptr.decrypt(user.password);
        } catch (error) {
            console.log("DECRYPT ERROR:", error);

            return sendBadRequest(
                res,
                "Unable to verify current password"
            );
        }

        console.log("OLD PASSWORD CHECK:", oldPassword === currentPassword);

        if (oldPassword !== currentPassword) {
            return sendBadRequest(
                res,
                "Current password is incorrect"
            );
        }

        // New password encrypt
        user.password = cryptr.encrypt(password);

        await user.save();

        console.log("PASSWORD UPDATED SUCCESSFULLY");

        return sendSuccess(
            res,
            "Password changed successfully"
        );

    } catch (error) {
        console.log("CHANGE PASSWORD ERROR:", error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};




// ===============================
// ADMIN - GET ALL USERS
// ===============================

const getAllUsersForAdmin = async (req, res) => {
    try {

        const users = await UserModel.find({})
            .select("_id name email mobile role status createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        });

    } catch (error) {

        console.log("GET ADMIN USERS ERROR:", error);

        return sendServerError(
            res,
            "Unable to fetch users"
        );
    }
};


// ===============================
// ADMIN - UPDATE USER ROLE
// ===============================

const updateUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { role } = req.body;

        // ===============================
        // VALID ROLE CHECK
        // ===============================

        const allowedRoles = [
            "user",
            "admin",
            "superadmin"
        ];

        if (!allowedRoles.includes(role)) {
            return sendBadRequest(
                res,
                "Invalid role"
            );
        }


        // ===============================
        // FIND TARGET USER
        // ===============================

        const user = await UserModel.findById(id);

        if (!user) {
            return sendNotFound(
                res,
                "User not found"
            );
        }


        // ===============================
        // PREVENT SELF ROLE CHANGE
        // ===============================

        if (user._id.toString() === req.user._id.toString()) {
            return sendBadRequest(
                res,
                "You cannot change your own role"
            );
        }


        // ===============================
        // ADMIN RESTRICTION
        // ===============================

        // Normal admin cannot manage superadmin
        if (req.user.role === "admin") {

            // Admin cannot change a superadmin
            if (user.role === "superadmin") {
                return res.status(403).json({
                    success: false,
                    message: "Admin cannot modify a superadmin"
                });
            }

            // Admin cannot assign superadmin role
            if (role === "superadmin") {
                return res.status(403).json({
                    success: false,
                    message: "Only superadmin can assign superadmin role"
                });
            }
        }


        // ===============================
        // UPDATE ROLE
        // ===============================

        user.role = role;

        await user.save();


        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {

        console.log("UPDATE USER ROLE ERROR:", error);

        return sendServerError(
            res,
            "Unable to update user role"
        );
    }
};




const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return sendSuccess(
            res,
            "Logout successful"
        );

    } catch (error) {
        console.log("LOGOUT ERROR:", error);

        return sendServerError(
            res,
            "Unable to logout"
        );
    }
};




export {
    register,
    verifyOtp,
    resendOtp,
    login,
    getProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    changeDefaultAddress,
    makeDefaultAddress,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    changePassword,
    getAllUsersForAdmin,
    updateUserRole,
    logout
}