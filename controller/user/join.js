const { user } = require("../../models");
const bcrypt = require("bcrypt");

module.exports = {
  post: async (req, res) => {
    const { email, nickname, password } = req.body;

    // 하나의 컬럼이라도 비었을 경우 400에러
    if (!email || !nickname || !password) {
      return res.status(400).json({ message: "빈칸이 존재 합니다." });
    }

    // 이미 존재하는 이메일인지 확인
    const checkEmail = await user.findOne({
      where: { email: email },
    });

    // 이메일이 중복된다면 403에러
    if (checkEmail) {
      return res.status(403).json({ message: "이미 존재하는 이메일 입니다." });
    }

    // 닉네임이 10자가 넘어간다면 403에러
    if (nickname.length > 10) {
      return res.status(403).json({ message: "닉네임은 10자 이하 입니다." });
    }

    // 비밀번호 영문,숫자 포함하는지 확인
    function checkPw(pw) {
      var reg = /[A-Za-z]/g;
      var reg2 = /[0-9]/g;
      return reg.test(pw) && reg2.test(pw);
    }

    // 영문,숫자를 포함하지 않는다면 403에러
    if (checkPw(password) === false) {
      return res
        .status(403)
        .json({ message: "영문과 숫자를 모두 포함 해야합니다." });
    }

    // 패스워드 암호화를 위한 솔트생성 및 해쉬화 진행
    bcrypt.genSalt(10, (err, salt) => {
      // 솔트생성 실패시 오류 메세지 전송
      if (err) {
        return res.status(400).json({ message: "솔트생성에 실패했습니다." });
      }
      // 솔트생성 성공시 해쉬화 진행
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err)
          return res.status(400).json({
            message: "패스워드 해쉬화에 실패했습니다.",
          });
        user
          .create({
            email: email,
            password: hash,
            nickname: nickname,
          })
          .then(() => {
            res.status(201).json({ data: "ok" });
          });
      });
    });
  },
};
