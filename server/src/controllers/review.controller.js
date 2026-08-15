import Review from "../models/Review.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Order from "../models/Order.js";

export const createReview = asyncHandler(async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);

    // Check if product exists first
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Seller cannot review their own product
    if (product.seller.toString() === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You cannot review your own product.",
      });
    }

    // User must have purchased and received the product
    const purchased = await Order.findOne({
      user: req.user.id,
      "items.product": productId,
      status: "Delivered",
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message:
          "You can only review products you have purchased and received.",
      });
    }

    // Prevent duplicate reviews
    const existing = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product.",
      });
    }

    // Create review
    await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment,
    });

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: "Review added.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const updateProductRating=asyncHandler(async(productId)=>{

const reviews=await Review.find({

product:productId

});

const total=reviews.reduce(

(sum,item)=>sum+item.rating,
0

);

const average=

reviews.length===0
?0
:total/reviews.length;

await Product.findByIdAndUpdate(

productId,

{

averageRating:average,
numReviews:reviews.length

}

);

});

export const getReviews=asyncHandler(async(req,res)=>{

try{

const reviews=await Review.find({

product:req.params.productId

})
.populate("user","firstName lastName");

res.json({

success:true,
count:reviews.length,
data:reviews

});

}
catch(err){

res.status(500).json({

success:false,
message:err.message

});

}

});

export const deleteReview=asyncHandler(async(req,res)=>{

try{

const review=await Review.findById(req.params.id);

if(!review){

return res.status(404).json({

success:false,
message:"Review not found."

});

}

if(review.user.toString()!=req.user.id){

return res.status(403).json({

success:false,
message:"Unauthorized"

});

}

const productId=review.product;

await review.deleteOne();

await updateProductRating(productId);

res.json({

success:true,
message:"Review deleted."

});

}
catch(err){

res.status(500).json({

success:false,
message:err.message

});

}

});