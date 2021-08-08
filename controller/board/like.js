const { board } = require("../../models");
const { user } = require("../../models");
const { like } = require("../../models");
const { verifyAccessToken } = require("../../middleware/checkToken");

module.exports = {
  post: async (req, res) => {
    const authorization = req.headers.authorization;

    // 헤더에 authorization토큰이 있는지 확인한다
    if (authorization) {
      // 있다면 토큰의 유효성 검사를 한다
      const token = verifyAccessToken(authorization);
      if (token !== null) {
        // 유저 id
        const userId = token.id;
        // 게시물 id
        const boardId = req.params.id;

        // 먼저 유저가 게시물에 이미 좋아요를 눌렀는지 안눌렀는지 판별한다
        const userLike = await like.findOne({
          where: { boardId: boardId, userId: userId },
        });

        if (!userLike) {
          // 유저가 좋아요를 누르지 않았다면 게시물에 좋아요를 +1 한다
          const findBoard = await board.findOne({ where: { id: boardId } });
          await findBoard.increment("like");

          // isLike의 값도 true로 변경한다
          await board.update(
            {
              isLike: true,
            },
            {
              where: { id: boardId },
            }
          );

          // like 테이블을 만들어서 유저가 해당 게시글에 좋아요를 눌렀다는걸 남긴다
          await like.create({
            boardId: boardId,
            userId: userId,
          });

          // 업데이트 후 필요한 정보만 넣어서 보낸다
          const boardInfo = await board.findOne({
            where: { id: boardId },
            include: [
              {
                model: user,
                attributes: ["nickname"],
              },
            ],
            attributes: { exclude: ["updatedAt"] },
          });

          return res.status(200).json({ boardInfo });
        } else {
          // 이미 좋아요를 눌렀다면 400에러
          return res
            .status(400)
            .json({ message: "이미 좋아요를 누른 상태입니다." });
        }
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
