const formidable = require("formidable");
const fs = require("fs");
const Product = require("../models/product");
const SubCategory = require("../models/subCategory");
const Category = require("../models/category");

const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash");
const { error } = require("console");
const subCategory = require("../models/subCategory");
const product = require("../models/product");

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    req.product = product;
    next();
  } catch (error) {
    console.error("Error in Product Id", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.read = async (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};
exports.create = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({
        error: "Image could not be uploaded",
        details: err.message,
      });
    }

    // console.log("Fields:", fields);
    // console.log("Files:", files);

    // Extract values from arrays
    const name = fields.name ? fields.name[0] : "";
    const description = fields.description ? fields.description[0] : "";
    const price = fields.price ? fields.price[0] : "";
    const stock = fields.stock ? fields.stock[0] : "";
    const category = fields.category ? fields.category[0] : "";
    const mainCategory = fields.mainCategory ? fields.mainCategory[0] : "";

    const status = fields.status ? fields.status[0] : "";
    console.log("*********************************", status);
    // Basic validation
    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !mainCategory
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const existingCategory = await Category.findOne({ name: mainCategory });
    if (!existingCategory) {
      return res.status(400).json({
        error: " Category is not found",
      });
    }
    const existingSub_Category = await subCategory.findOne({ name: category });
    if (!existingSub_Category) {
      return res.status(400).json({
        error: " Sub_Category is not found",
      });
    }

    let product = new Product({
      name,
      description,
      price,
      stock,
      category: existingSub_Category._id, 
      mainCategory: existingCategory._id, 
      status,
    });

    if (files.photo) {
      const photo = files.photo[0]; // Access the first photo object inside the array
      console.log("Photo:", photo);

      if (!photo.filepath || !photo.mimetype) {
        return res.status(400).json({
          error: "Invalid file data",
        });
      }

      if (photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1MB in size",
        });
      }

      try {
        product.photo.data = fs.readFileSync(photo.filepath);
        product.photo.contentType = photo.mimetype;
      } catch (readError) {
        console.error("File read error:", readError);
        return res.status(400).json({
          error: "Error reading the file",
          details: readError.message,
        });
      }
    }

    console.log("Product before save:", product);

    try {
      const result = await product.save();
      res.json(result);
    } catch (saveErr) {
      console.error("Save error:", saveErr);
      return res.status(400).json({
        error: errorHandler(saveErr),
      });
    }
  });
};

exports.remove = async (req, res) => {
  try {
    let product = req.product;
    let dltPrdt = await product.deleteOne();
    if (!dltPrdt) {
      return res.status(400).json({
        error: errorHandler(erroor),
      });
    }
    res.json({ message: "Product successfuly deleted" });
  } catch (error) {
    console.error("Error in Product Id", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updatePdt = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({
        error: "Image could not be uploaded",
        details: err.message,
      });
    }

    console.log("Fields:", fields);
    console.log("Files:", files);

    // Extract values from arrays, converting single-value arrays to single values
    const name = fields.name ? fields.name[0] : "";
    const description = fields.description ? fields.description[0] : "";
    const price = fields.price ? fields.price[0] : "";
    const stock = fields.stock ? fields.stock[0] : "";
    const category = fields.category ? fields.category[0] : "";
    const status = fields.status ? fields.status[0] : "";

    // Basic validation
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = req.product;
    product = _.extend(product, {
      name,
      description,
      price,
      stock,
      category,
      status,
    });

    if (files.photo) {
      const photo = files.photo[0]; // Access the first photo object inside the array
      console.log("Photo:", photo);

      if (!photo.filepath || !photo.mimetype) {
        return res.status(400).json({
          error: "Invalid file data",
        });
      }

      if (photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1MB in size",
        });
      }

      try {
        product.photo.data = fs.readFileSync(photo.filepath);
        product.photo.contentType = photo.mimetype;
      } catch (readError) {
        console.error("File read error:", readError);
        return res.status(400).json({
          error: "Error reading the file",
          details: readError.message,
        });
      }
    }

    console.log("Product before save:", product);

    try {
      const result = await product.save();
      res.json(result);
    } catch (saveErr) {
      console.error("Save error:", saveErr);
      return res.status(400).json({
        error: errorHandler(saveErr),
      });
    }
  });
};





/**
 * sell / arrival
 * by sell= /products?sortBy=sold&order=desc&limit=4
 * by arrival= /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent all products are returned 
 */

exports.list = async (req, res) => {
  try {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : "6";

    console.log(`Order: ${order}, SortBy: ${sortBy}, Limit: ${limit}`);

    const products = await Product.find()
      .select("-photo")
      .populate({
        path: 'category',
        select: 'name' // Only include the name field
    })
    .populate({
        path: 'mainCategory',
        select: 'name' // Only include the name field
    })
    
      .sort([[sortBy, order]])
      .limit(limit);
    if (!products) {
      res.status(400).json({
        error: "Product not found",
      });
    }
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while fetching products",
    });
  }
};

// LIST RELATED PRODUCTS
/**
 *it will find the products based  on the req product category
 * other products that has the same category, will be returned
 */
 exports.listRelated = async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    try {
        const relatedProducts = await Product.find({
            _id: { $ne: req.product._id },
            category: req.product.category,
            mainCategory: req.product.mainCategory
        })
        .limit(limit)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'mainCategory',
            select: 'name'
        });

        if (!relatedProducts.length) {
            return res.status(400).json({
                error: "No related products found"
            });
        }

        res.json(relatedProducts);
    } catch (error) {
        console.error("Error fetching related products:", error);
        return res.status(500).json({
            error: "An error occurred while fetching related products",
            details: error.message
        });
    }
};


exports.listCategorise  = async(req, res)=>{
  try {
    const categorise = await Product.distinct("mainCategory", {})
    if(!categorise){
        return res.status(400).json({
                error: "No related Categoris found"
        })
      }
      res.json(categorise)
    
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while fetching related products",
      details: error.message
  });
    
  }
}


exports.  list_Sub_Categorise= async(req, res)=>{
  try {
    const subCategorise = await Product.distinct("category", {})
    if(!subCategorise){
        return res.status(400).json({
                error: "No related Categoris found"
        })
      }
      res.json(subCategorise)
    
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while fetching related products",
      details: error.message
  });
    
  }
}


    /**
     * list products by search
     * we will implement product search in react frontend
     * we will show categories in checkbox and price range in radio buttons
     * as the user clicks on those checkbox and radio buttons
     * we will make api request and show the products to users based on what he wants
     */
     
   
     
    exports.listBySearch = async(req, res) => {
      try {
        let order = req.body.order ? req.body.order : "desc";
        let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
        let limit = req.body.limit ? parseInt(req.body.limit) : 100;
        let skip = parseInt(req.body.skip);
        let findArgs = {};
     
        // console.log(order, sortBy, limit, skip, req.body.filters);
        // console.log("findArgs", findArgs);
     
        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === "price") {
                    // gte -  greater than price [0-10]
                    // lte - less than
                    findArgs[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1]
                    };
                } else {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }
     
     const data =   await Product.find(findArgs)
            .select("-photo")
            .populate("category")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)

        if(!data){
          return res.status(400).json({
            error: "Products not found"
        });

        }
        res.json({
          size: data.length,
          data
      });
           
        
      } catch (error) {
        return res.status(500).json({
          error: "An error occurred while fetching related products",
          details: error.message
      });
        
      }
      
    };

    
    exports.photo = async(req, res, next)=>{
      if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
      }
      next()

    }