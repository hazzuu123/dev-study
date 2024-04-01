import express from "express";

import conn from "../mariadb.js";

const router = express.Router();

router
  .route("/")
  // 전체 리뷰 조회: GET "/reviews"
  .get((req, res) => {
    let sql = `SELECT * FROM reviews`;

    conn.query(sql, (err, results) => {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "전체 조회할 리뷰가 없습니다." });
      }
    });
  })
  // 리뷰 등록: POST "/reviews"
  .post((req, res) => {
    const { userId, title, description } = req.body;
    if (!userId) {
      res.status(400).json({ message: "작성자 아이디를 제대로 보내주세요." });
      return;
    }
    if (!title) {
      res.status(400).json({ message: "상점 이름을 제대로 보내주세요." });
      return;
    }
    if (!description) {
      res.status(400).json({ message: "리뷰 컨텐츠를 제대로 보내주세요." });
      return;
    }

    let sql = `INSERT INTO reviews (user_id, title, description) VALUES(?, ?, ?)`;
    let values = [userId, title, description];
    conn.query(sql, values, (err, results) => {
      if (err) {
        res.status(500).json({ message: "데이터 베이스 연동 오류입니다." });
      }
      res.status(200).json(results);
    });
  });

router
  .route("/:id")
  // 개별 리뷰 조회: GET "/reviews/:id"
  .get((req, res) => {
    const { id } = req.params;

    let sql = `SELECT * FROM reviews WHERE id = ?`;

    conn.query(sql, [id], (err, results) => {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "조회할 리뷰가 없습니다." });
      }
    });
  })
  // 리뷰 삭제: DELETE "/reviews/:id"
  .delete((req, res) => {
    const { id } = req.params;

    let sql = `DELETE FROM reviews WHERE id = ?`;

    conn.query(sql, [id], (err, results) => {
      res.status(200).json(results);
    });
  });

export default router;
