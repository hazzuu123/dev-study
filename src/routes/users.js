import express from "express";
import { body, validationResult } from "express-validator";

import conn from "../mariadb.js";

const router = express.Router();

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.status(400).json(err);
    return;
  }
  next();
};

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
  .post(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("이메일 형식으로 보내주세요."),
      body("password")
        .notEmpty()
        .isString()
        .withMessage("문자열로 보내주세요."),
      body("nickname")
        .notEmpty()
        .isString()
        .withMessage("문자열로 보내주세요."),
      validate,
    ],
    (req, res) => {
      const { email, password, nickname } = req.body;

      let sql = `INSERT INTO users (email, password, nickname) VALUES(?, ?, ?)`;
      let values = [email, password, nickname];

      conn.query(sql, values, (err, results) => {
        if (err) {
          return res.status(400).json(err);
        }
        res
          .status(201)
          .json({ message: `${nickname}님 회원가입이 완료되었습니다.` });
      });
    }
  )

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
  .delete(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("이메일 형식으로 보내주세요."),
      validate,
    ],
    (req, res) => {
      const { email } = req.body;

      let sql = `DELETE FROM users WHERE email = ?`;
      conn.query(sql, [email], (err, results) => {
        if (results.affectedRows === 0) {
          return res.status(400).json({ message: "없는 계정입니다." });
        }
        res.status(200).json(results);
      });
    }
  );

router
  .route("/detail")
  // 유저 개별 조회
  .get(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("이메일 형식으로 보내주세요."),
      validate,
    ],
    (req, res) => {
      const { email } = req.body;

      let sql = `SELECT * FROM users WHERE email = ?`;
      conn.query(sql, [email], (err, results) => {
        if (results.length) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: "회원 정보가 없습니다." });
        }
      });
    }
  );

export default router;
