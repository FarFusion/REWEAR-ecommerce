import Product from "../models/Product.js";

const checkProductOwner = async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found."
        });
    }

    if (
        product.seller.toString() !== req.user.id &&
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            success: false,
            message: "Access denied."
        });
    }

    req.product = product;

    next();
};

export default checkProductOwner;