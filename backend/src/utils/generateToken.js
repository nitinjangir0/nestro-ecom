import jwt from "jsonwebtoken";

function generateToken(id) {
    const token = jwt.sign({ id }, process.env.CLOUDINARY_API_SECRET,  { expiresIn: "7d" });
    return token;
}

export default generateToken;
