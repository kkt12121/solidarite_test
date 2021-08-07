const { board } = require("../../models");
const { user } = require("../../models");

module.exports = {
  post: async (req, res) => {
    const { title, content } = req.body;
    // 게시물 생성하는 유저의 고유id를 체크한다
    const userId = res.locals.id;

    // 하나의 컬럼이라도 비었을 경우 400에러
    if (!title || !content) {
      return res.status(400).json({ data: "제목 또는 내용이 없습니다." });
    }

    // 제목의 길이가 30자가 넘어가면 403에러
    if (title.length > 30) {
      return res.status(403).json({ data: "제목은 30자 이하 입니다." });
    }

    // 모든 조건에 충족하면 게시물을 생선한다
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
  },
};
