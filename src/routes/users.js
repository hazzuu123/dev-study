import express from "express";

import conn from "../mariadb.js";

const router = express.Router();

router
  .route("/")
  // 전체 유저 조회
  .get((req, res) => {
    let sql = `SELECT * FROM users`;
    conn.query(sql, (err, results) => {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "조회할 정보가 없습니다." });
      }
    });
  })

  // 회원 가입
  .post((req, res) => {
    const { email, password, nickname } = req.body;
    if (!password || !email || !nickname) {
      res.status(400).json({ message: "요청값이 부족합니다." });
      return;
    }

    let sql = `INSERT INTO users (email, password, nickname) VALUES(?, ?, ?)`;
    let values = [email, password, nickname];

    conn.query(sql, values, (err, results) => {
      res
        .status(201)
        .json({ message: `${nickname}님 회원가입이 완료되었습니다.` });
    });
  })

  // 유저 개별 정보 수정 (PATCH)
  .patch((req, res) => {
    let { email, password, nickname } = req.body;

    if (!email) {
      res.status(400).json({ message: "요청값이 부족합니다." });
      return;
    }

    let sql = `UPDATE users SET password = ?, nickname = ? WHERE email = ?`;
    let values = [password, nickname, email];

    conn.query(sql, values, (err, results) => {
      res.status(201).json(results);
    });
  })

  // 회원 탈퇴
  .delete((req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "요청값이 부족합니다." });
      return;
    }

    let sql = `DELETE FROM users WHERE email = ?`;
    conn.query(sql, [email], (err, results) => {
      res.status(200).json(results);
    });
  });

router
  .route("/detail")
  // 유저 개별 조회
  .get((req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "요청값이 부족합니다." });
      return;
    }

    let sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, [email], (err, results) => {
      if (results.length) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: "회원 정보가 없습니다." });
      }
    });
  });

export default router;
