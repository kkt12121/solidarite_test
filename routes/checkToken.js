const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, data) => {
      if (err) {
        return res
          .status(401)
          .json({ data: "토큰이 만료되었습니다. 재로그인 해주세요" });
      } else {
        res.locals.id = data.id;
        next();
      }
    });
  } else {
    return res.status(401).json({ data: "토큰이 없습니다." });
  }
};
