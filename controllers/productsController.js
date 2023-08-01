const Product = require("../models/Products");

module.exports = {
  createProduct: async (req, res) => {
    const products = await Product.create(req.body);
    try {
      await products.save();
      res.status(200).json("Product created successfully.");
    } catch (error) {
      res.status(500).json("Failed to create product");
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      console.log({ products });
      res.status(200).json(products);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).json("Failed to fetch products");
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json("Failed to fetch the product");
    }
  },

  searchProduct: async (req, res) => {
    try {
      // const result = await Product.find({
      //   $or: [
      //     { title: { $regex: req.params.key } },
      //     { description: { $regex: req.params.key } },
      //     { supplier: { $regex: req.params.key } },
      //     { product_location: { $regex: req.params.key } },
      //   ],
      // });

      const result = await Product.aggregate([
        {
          $search: {
            index: "ecommerce",
            text: {
              query: req.params.key,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ]);
      res.status(200).json(result);
    } catch (error) {
      console.log({ error });
      res.status(500).json("Failed to fetch the products");
    }
  },
};
