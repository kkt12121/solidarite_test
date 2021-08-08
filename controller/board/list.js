const { board } = require("../../models");
const { user } = require("../../models");

module.exports = {
  get: async (req, res) => {
    // 게시물이 있다면 필요한 정보들만 담아서 보낸다
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
