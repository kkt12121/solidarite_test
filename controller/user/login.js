const { user } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../../middleware/checkToken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  post: async (req, res) => {
    const { email, password } = req.body;

    // 로그인 시도하는 이메일이 db에 저장되어있는 이메일인지 확인
    const userInfo = await user.findOne({
      where: { email: email },
    });

    if (userInfo) {
      // 일치한다면 로직에 적은 패스워드가 db에 암호화로 저장된 패스워드와 일치하는지 확인
      bcrypt.compare(password, userInfo.password, async (err, isMatch) => {
        if (err) {
          return res.status(400).json({ data: "검증에 실패하였습니다." });
        }
        // 비밀번호가 일치하다면 토큰생성후 로그인
        if (isMatch) {
          // jwt
          const accessToken = generateAccessToken(userInfo);
          // 패스워드를 제외한 유저 정보
          const { password, ...data } = { ...userInfo.dataValues };

          res.status(200).json({ token: accessToken, user: data });
        } else {
          return res.status(400).json({
            data: "비밀번호가 틀렸습니다.",
          });
        }
      });
    } else {
      // 만약 일치하는 이메일이 없으면 403에러
      return res.status(403).json({ data: "존재하지 않는 이메일 입니다." });
    }
  },
};
