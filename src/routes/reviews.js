import express from "express";
import { body, param, validationResult } from "express-validator";
import conn from "../mariadb.js";

const router = express.Router();

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.json(err);
    return;
  }
  next();
};
router
  .route("/")
  // 전체 리뷰 조회: GET "/reviews"
  .get(
    [
      body("userId").notEmpty().isInt().withMessage("Not Integer value"),
      validate,
    ],
    (req, res) => {
      const { userId } = req.body;

      let sql = `SELECT * FROM reviews WHERE user_id = ?`;

      conn.query(sql, [userId], (err, results) => {
        if (results.length) {
          res.status(200).json(results);
        } else {
          res.status(404).json({ message: "전체 조회할 리뷰가 없습니다." });
        }
      });
    }
  )
  // 리뷰 등록: POST "/reviews"
  .post(
    [
      body("userId").notEmpty().isInt().withMessage("Not Integer value"),
      body("title").notEmpty().isString().withMessage("Not String value"),
      body("description").notEmpty().isString().withMessage("Not String value"),
      validate,
    ],
    (req, res) => {
      const { userId, title, description } = req.body;

      let sql = `INSERT INTO reviews (user_id, title, description) VALUES(?, ?, ?)`;
      let values = [userId, title, description];
      conn.query(sql, values, (err, results) => {
        if (err) {
          res.status(500).json({ message: "데이터 베이스 연동 오류입니다." });
        }
        res.status(200).json(results);
      });
    }
  );

router
  .route("/:id")
  // 개별 리뷰 조회: GET "/reviews/:id"
  .get(
    [param("id").notEmpty().isInt().withMessage("Not Integer value"), validate],
    (req, res) => {
      const { id } = req.params;

      let sql = `SELECT * FROM reviews WHERE id = ?`;

      conn.query(sql, [id], (err, results) => {
        if (results.length) {
          res.status(200).json(results);
        } else {
          res.status(404).json({ message: "조회할 리뷰가 없습니다." });
        }
      });
    }
  )
  // 리뷰 삭제: DELETE "/reviews/:id"
  .delete(
    [param("id").notEmpty().isInt().withMessage("Not Integer value"), validate],
    (req, res) => {
      const { id } = req.params;

      let sql = `DELETE FROM reviews WHERE id = ?`;

      conn.query(sql, [id], (err, results) => {
        res.status(200).json(results);
      });
    }
  );

export default router;
