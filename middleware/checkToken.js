const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  generateAccessToken: (data) => {
    return jwt.sign({ id: data.id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "3h",
    });
  },
  verifyAccessToken: (data) => {
    const token = data.split(" ")[1];
    // 만약 검증에 통과하면 다음으로 넘어가고 통과하지 못하면
    // null return
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch {
      return null;
    }
  },
};
