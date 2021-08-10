const { board } = require("../../models");
const { user } = require("../../models");
const { like } = require("../../models");
const { verifyAccessToken } = require("../../middleware/checkToken");

module.exports = {
  get: async (req, res) => {
    // 게시물 id
    const boardId = req.params.id;
    // 토큰 여부
    const authorization = req.headers.authorization;

    // 먼저 해당 게시물이 db에 존재하는지 확인한다
    const findBoard = await board.findOne({ where: { id: boardId } });

    if (findBoard) {
      // 해당 게시물이 존재 한다면 헤더에 토큰 여부를 확인한다
      if (!authorization) {
        // 토큰이 없어서 로그인 상태가 아니라면 해당 게시물을 찾아서 isLike의 값을 false로 반환한다
        await board.update(
          {
            isLike: false,
          },
          {
            where: { id: boardId },
          }
        );

        // 필요한 게시물의 정보를 보내준다
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
        // 토큰이 존재 한다면 토큰의 유효성 검사를 한다
        const token = verifyAccessToken(authorization);
        if (token !== null) {
          // 로그인 유저 id
          const userId = token.id;
          // 유저가 해당 게시물에 좋아요를 눌렀는지 확인한다
          const checkLikeUser = await like.findOne({
            where: { boardId: boardId, userId: userId },
          });
          if (checkLikeUser) {
            // 로그인 상태이고 게시물에 좋아요를 눌렀을 경우 isLike의 값을 true로 반환한다
            await board.update(
              {
                isLike: true,
              },
              {
                where: { id: boardId },
              }
            );

            // 필요한 게시물의 정보를 보내준다
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
            // 로그인은 했지만 좋아요를 누르지 않았을 경우 해당 게시물을 찾아서 isLike의 값을 false로 반환한다
            await board.update(
              {
                isLike: false,
              },
              {
                where: { id: boardId },
              }
            );

            // 필요한 게시물의 정보를 보내준다
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
        } else {
          // 토큰이 만료 되었다면 비로그인 상태이기에 isLike값을 false로 반환한다
          await board.update(
            {
              isLike: false,
            },
            {
              where: { id: boardId },
            }
          );

          // 필요한 게시물의 정보를 보내준다
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
      }
    } else {
      return res.status(404).json({ message: "해당 게시물이 없습니다." });
    }
  },
};
