import express from "express";
const router = express.Router();
import {protect,authorize} from "../middleware/auth.js";
import { register,  verifyOtp, resendOtp, login, getProfile,changePassword,checkout , addAddress, updateAddress ,deleteAddress, changeDefaultAddress, makeDefaultAddress,forgotPassword,verifyForgotPasswordOtp,resetPassword,getAllUsersForAdmin,updateUserRole,logout} from "../controllers/user.controller.js";

router.post("/register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/logout", logout);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/change-password",protect,changePassword);
router.post("/checkout", protect, checkout);
router.post("/add-address", protect, addAddress);
router.put("/update-address/:addressId", protect, updateAddress);
router.delete( "/delete-address/:id", protect, deleteAddress );
router.patch("/default-address/:addressId", protect, changeDefaultAddress);
router.put( "/default-address/:id", protect, makeDefaultAddress);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
router.post("/reset-password", resetPassword);
router.get("/admin/users",protect,authorize("admin", "superadmin"),getAllUsersForAdmin);
router.patch("/admin/users/:id/role",protect,authorize("admin", "superadmin"),updateUserRole);

export default router
