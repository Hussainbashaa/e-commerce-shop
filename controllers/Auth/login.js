import { User } from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found, please signup" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: `Login successful welcome back ${user.name}`,
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
