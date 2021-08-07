const { board } = require("../../models");
const { user } = require("../../models");

module.exports = {
  get: async (req, res) => {
    // 필요한 정보만 담아서 모든 게시글 목록을 보낸다
    const boardList = await board.findAll({
      include: [
        {
          model: user,
          attributes: ["nickname"],
        },
      ],
      attributes: { exclude: ["isLike", "updatedAt"] },
    });

    return res.status(200).json({ boardList });
  },
};
