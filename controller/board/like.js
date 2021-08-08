const { board } = require("../../models");
const { user } = require("../../models");
const { like } = require("../../models");

module.exports = {
  post: async (req, res) => {
    // 게시물 id
    const boardId = req.params.id;
    // 유저 id
    const userId = res.locals.id;

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

      // 좋아요를 눌렀다면 like 테이블을 만들어서 유저가 해당 게시글에 좋아요를 눌렀다는걸 남긴다
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
    }
  },
};
