import express from "express";

const app = express();

// 리뷰 데이터
let id = 0;
let reviews = new Map();

// 미들웨어 등록
app.use(express.json());

// app.route()
// 전체 리뷰 조회: GET "/reviews"
// 리뷰 등록: POST "/reviews"
app
  .route("/reviews")
  .get((req, res) => {
    if (!reviews.size) {
      return res.status(404).json({ message: "전체 조회할 리뷰가 없습니다." });
    }
    let objectReviews = {};
    reviews.forEach((review, key) => (objectReviews[key] = review));
    res.status(200).json(objectReviews);
  })
  .post((req, res) => {
    const { title, description, author, image } = req.body;
    if (!title) {
      res.status(400).json({ message: "상점 이름이 없습니다." });
      return;
    }
    if (!description) {
      res.status(400).json({ message: "리뷰 컨텐츠가 없습니다." });
      return;
    }
    if (!author) {
      res.status(400).json({ message: "작성자가 없습니다." });
      return;
    }
    if (!image) {
      res.status(400).json({ message: "이미지가 없습니다." });
      return;
    }
    reviews.set(id++, req.body);
    res.status(200).json(reviews.get(id - 1));
  });

// 개별 리뷰 조회: GET "/reviews/:id"
// 리뷰 삭제: DELETE "/reviews/:id"
app
  .route("/reviews/:id")
  .get((req, res) => {
    const { id } = req.params;
    const findReview = reviews.get(Number(id));
    if (!findReview) {
      res.status(404).json({ message: "리뷰 데이터가 없습니다." });
    } else {
      res.status(200).json(findReview);
    }
  })
  .delete((req, res) => {
    const { id } = req.params;
    const review = reviews.get(Number(id));
    if (!review) {
      return res.status(404).json({ message: "삭제할 리뷰가 없습니다." });
    }
    reviews.delete(Number(id));
    res.status(204).json({});
  });

app.listen(8000);
