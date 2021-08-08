const { board } = require("../../models");
const { user } = require("../../models");
const { like } = require("../../models");
const { verifyAccessToken } = require("../../middleware/checkToken");

module.exports = {
  delete: async (req, res) => {
    const boardId = req.params.id;
    const authorization = req.headers.authorization;

    // 먼저 해당 게시물을 찾는다
    const findBoard = await board.findOne({ where: { id: boardId } });
    if (findBoard) {
      // 해당 게시물이 존재한다면 헤더에 authorization토큰이 있는지 확인한다
      if (authorization) {
        // 토큰이 있다면 토큰의 유효성 검사를 한다
        const token = verifyAccessToken(authorization);
        if (token !== null) {
          // 로그인 상태를 확인 했다면 로그인 유저가 해당 게시물의 작성자인지 확인한다
          const userId = token.id;
          if (findBoard.userId === userId) {
            // 게시물의 작성자라면 게시물을 지운다
            // 먼저 해당 게시물의 id값이 들어간 like테이블을 지운후 board테이블을 지운다
            like.destroy({ where: { boardId: boardId } }).then(() => {
              board.destroy({ where: { id: boardId } });
            });
            return res.status(200).json({ data: "ok" });
          } else {
            // 해당 게시물의 작성자가 아닐경우 401에러
            return res
              .status(401)
              .json({ message: "해당 게시물의 작성자가 아닙니다." });
          }
        } else {
          // 토큰이 만료 되었다면 401에러
          return res.status(401).json({ message: "권한이 없습니다." });
        }
      } else {
        // 헤더에 authorization이 없다면 401에러
        return res.status(401).json({ message: "토큰이 없습니다." });
      }
    } else {
      // 해당 게시물이 존재하지 않는다면 404에러
      return res.status(404).json({ message: "해당 게시물이 없습니다." });
    }
  },
};
