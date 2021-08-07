const { user } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  post: async (req, res) => {
    const { email, password } = req.body;

    // 로그인 시도하는 이메일이 db에 일치하는 이메일 확인
    const userInfo = await user.findOne({
      where: { email: email },
    });
    // 만약 일치하는 이메일이 없으면 403에러
    if (!userInfo) {
      return res.status(403).json({ data: "존재하지 않는 이메일 입니다." });
    } else {
      // 일치한다면 로직에 적은 패스워드가 db에 암호화로 저장된 패스워드와 일치하는지 확인
      bcrypt.compare(password, userInfo.password, async (err, isMatch) => {
        if (err) {
          return res.status(400).json({ data: "검증에 실패하였습니다." });
        }
        // 비밀번호가 일치하다면 토큰생성후 로그인
        if (isMatch) {
          // jwt
          const accessToken = jwt.sign(
            { id: userInfo.id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "3h" }
          );
          // 패스워드를 제외한 유저 정보
          const { password, ...data } = { ...userInfo.dataValues };

          res.status(200).json({ token: accessToken, user: data });
        } else {
          return res.status(400).json({
            data: "비밀번호가 틀렸습니다.",
          });
        }
      });
    }
  },
};
