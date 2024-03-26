import express from "express";

const router = express.Router();

// 유저 데이터
let id = 1;
let db = new Map();

router
  .route("/")
  // 전체 유저 조회
  .get((req, res) => {
    if (!db.size) {
      res.status(404).json({ message: "조회할 유저 정보가 없습니다." });
      return;
    }
    let users = [];
    db.forEach((user) => users.push(user));
    res.status(200).json(users);
  })
  // 회원 가입
  .post((req, res) => {
    const { userId, password, email, nickname } = req.body;
    if (!userId || !password || !email || !nickname) {
      res.status(400).json({ message: "요청값이 부족합니다." });
      return;
    }
    db.set(id++, {
      userId,
      password,
      email,
      nickname,
    });
    res
      .status(201)
      .json({ message: `${nickname}님 회원가입이 완료되었습니다.` });
  });

router
  .route("/:id")
  // 유저 개별 조회
  .get((req, res) => {
    const { id } = req.params;
    const user = db.get(Number(id));
    if (!user) {
      res.status(404).json({ message: "회원 정보가 없습니다." });
      return;
    }
    res.status(200).json(user);
  })
  // 유저 개별 정보 수정 (PATCH)
  .patch((req, res) => {
    let { id } = req.params;
    id = Number(id);
    const user = db.get(id);
    if (!user) {
      res.status(404).json({ message: "회원 정보가 없습니다." });
      return;
    }

    const { password, email, nickname } = req.body;

    db.set(id, {
      userId: user.userId,
      password: password || user.password,
      email: email || user.email,
      nickname: nickname || user.nickname,
    });

    res.status(200).json({ message: "정보 수정이 완료되었습니다." });
  })
  // 회원 탈퇴
  .delete((req, res) => {
    const { id } = req.params;
    const user = db.get(Number(id));
    if (!user) {
      res.status(404).json({ message: "회원 정보가 없습니다." });
      return;
    }
    db.delete(Number(id));
    res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  });

export default router;
