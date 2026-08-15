import express from "express";

import auth from "../middleware/auth.js";

import {

createReview,
getReviews,
deleteReview

} from "../controllers/review.controller.js";

const router=express.Router();

router.post("/",auth,createReview);

router.get("/:productId",getReviews);

router.delete("/:id",auth,deleteReview);

export default router;