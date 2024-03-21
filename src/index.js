import express from "express";

const app = express();

// 리뷰 데이터
let id = 0;
let reviews = new Map();
reviews.set(id++, {
  title: "커피힐즈",
  description:
    "좋은 분위기와 맛있는 커피! 여기는 항상 편안한 분위기가 있어요. 직원들도 친절해서 자주 방문하게 되네요.",
  author: "카리나",
  image:
    "https://cdn.pixabay.com/photo/2017/05/12/08/29/coffee-2306471_1280.jpg",
});
reviews.set(id++, {
  title: "베이커리 블루",
  description: "정말정말 맛있어요!",
  author: "행복한 다람쥐",
  image:
    "https://cdn.pixabay.com/photo/2020/04/02/02/15/bakery-4993185_640.jpg",
});
reviews.set(id++, {
  title: "피자 플레이스",
  description:
    "이 곳에서는 정말 다양한 종류의 피자를 만날 수 있어요. 가격도 적당하고 양도 푸짐해서 가족과 함께 가기 좋아요.",
  author: "복많은 거복이",
  image:
    "https://media.istockphoto.com/id/1459715799/ko/%EC%82%AC%EC%A7%84/%ED%96%84%EA%B3%BC-%EC%B9%98%EC%A6%88%EB%A5%BC-%EA%B3%81%EB%93%A4%EC%9D%B8-%ED%94%BC%EC%9E%90.jpg?s=1024x1024&w=is&k=20&c=SLmzXX8AQ3jkqatjZgNR3ZSkD82NCFQtsYuT31eeeN4=",
});

// 미들웨어 등록
app.use(express.json());

// 전체 리뷰 조회 완성하기
app.get("/reviews", (req, res) => {
  if (!reviews.size) {
    return res.status(404).json({ message: "전체 조회할 리뷰가 없습니다." });
  }
  let objectReviews = {};
  reviews.forEach((review, key) => (objectReviews[key] = review));
  res.status(200).json(objectReviews);
});

// 특정 리뷰 조회하기
app.get("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const findReview = reviews.get(Number(id));
  if (!findReview) {
    res.status(404).json({ message: "리뷰 데이터가 없습니다." });
  } else {
    res.status(200).json(findReview);
  }
});

// 리뷰 등록하기
app.post("/reviews", (req, res) => {
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

// 특정 리뷰 삭제하기
app.delete("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const review = reviews.get(Number(id));
  if (!review) {
    return res.status(404).json({ message: "삭제할 리뷰가 없습니다." });
  }
  reviews.delete(Number(id));
  res.status(204).json({});
});

app.listen(8000);
