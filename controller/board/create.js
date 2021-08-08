const { board } = require("../../models");
const { user } = require("../../models");
const { verifyAccessToken } = require("../../middleware/checkToken");

module.exports = {
  post: async (req, res) => {
    const { title, content } = req.body;
    const authorization = req.headers.authorization;

    // 헤더에 authorization토큰이 있는지 확인한다
    if (authorization) {
      // 있다면 토큰의 유효성 검사를 한다
      const token = verifyAccessToken(authorization);
      if (token !== null) {
        // 유저 id
        const userId = token.id;

        // 하나의 컬럼이라도 비었을 경우 400에러
        if (!title || !content) {
          return res
            .status(400)
            .json({ message: "제목 또는 내용이 없습니다." });
        }

        // 제목의 길이가 30자가 넘어가면 403에러
        if (title.length > 30) {
          return res.status(403).json({ message: "제목은 30자 이하 입니다." });
        }

        // 모든 조건에 충족하면 게시물을 생성한다
        const boardCreate = await board.create({
          userId: userId,
          title: title,
          content: content,
        });
        // 생성한 게시물의 id값을 저장한다
        req.params.id = boardCreate.id;

        // 생성한 게시물에 유저의 닉네임을 포함시킨다
        const boardInfo = await board.findOne({
          where: {
            id: boardCreate.id,
          },
          include: [
            {
              model: user,
              attributes: ["nickname"],
            },
          ],
        });
        // 필요한 정보만 정보만 data에 담는다
        const { isLike, updatedAt, ...data } = { ...boardInfo.dataValues };

        return res.status(201).json({ data });
      } else {
        // 토큰이 만료 되었다면 401에러
        return res.status(401).json({ message: "권한이 없습니다." });
      }
    } else {
      // 헤더에 authorization이 없다면 401에러
      return res.status(401).json({ message: "토큰이 없습니다." });
    }
  },
};
