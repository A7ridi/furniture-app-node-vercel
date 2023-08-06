const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../models/Order");

module.exports = {
  orders: catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;

    try {
      const order = await Order.find({ userId })
        .populate({
          path: "productId",
          select: "-description -product_location",
        })
        .exec();

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }),
};
