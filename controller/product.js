const formidable = require("formidable");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash")


exports.productById = async(req, res, next, id)=>{
    try {
        const product= await Product.findById(id)
        if(!product){
            return res.status(400).json({ error: 'Product not found' });
        }
        req.product= product
        next()
        
    } catch (error) {
        console.error('Error in Product Id', error);
        return res.status(500).json({ error: 'Something went wrong' });
  
        
    }
}

exports.read = async(req, res)=>{
    req.product.photo = undefined
   return res.json(req.product)

}
exports.create = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parse error:", err);
            return res.status(400).json({
                error: 'Image could not be uploaded',
                details: err.message
            });
        }

        console.log("Fields:", fields);
        console.log("Files:", files);

        // Extract values from arrays
        const name = fields.name ? fields.name[0] : '';
        const description = fields.description ? fields.description[0] : '';
        const price = fields.price ? fields.price[0] : '';
        const stock = fields.stock ? fields.stock[0] : '';
        const category = fields.category ? fields.category[0] : '';
        const status = fields.status ? fields.status[0] : '';
        console.log("*********************************", status);
        // Basic validation
        if (!name || !description || !price || !stock || !category ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let product = new Product({ name, description, price, stock, category, status });

        if (files.photo) {
            const photo = files.photo[0]; // Access the first photo object inside the array
            console.log("Photo:", photo);

            if (!photo.filepath || !photo.mimetype) {
                return res.status(400).json({
                    error: "Invalid file data"
                });
            }

            if (photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1MB in size"
                });
            }

            try {
                product.photo.data = fs.readFileSync(photo.filepath);
                product.photo.contentType = photo.mimetype;
            } catch (readError) {
                console.error("File read error:", readError);
                return res.status(400).json({
                    error: 'Error reading the file',
                    details: readError.message
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
                error: errorHandler(saveErr)
            });
        }
    });
};

exports.remove = async(req, res)=>{
    try {
        let product = req.product
       let dltPrdt =  await product.deleteOne()
       if(!dltPrdt){
        return res.status(400).json({
            error: errorHandler(erroor)
        })
       }
       res.json({"message":"Product successfuly deleted"})

        
    } catch (error) {
        console.error('Error in Product Id', error);
        return res.status(500).json({ error: 'Something went wrong' });
  
        
    }
}

exports.updatePdt = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parse error:", err);
            return res.status(400).json({
                error: 'Image could not be uploaded',
                details: err.message
            });
        }

        console.log("Fields:", fields);
        console.log("Files:", files);

        // Extract values from arrays, converting single-value arrays to single values
        const name = fields.name ? fields.name[0] : '';
        const description = fields.description ? fields.description[0] : '';
        const price = fields.price ? fields.price[0] : '';
        const stock = fields.stock ? fields.stock[0] : '';
        const category = fields.category ? fields.category[0] : '';
        const status = fields.status ? fields.status[0] : '';
        

        // Basic validation
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let product = req.product;
        product = _.extend(product, {
            name,
            description,
            price,
            stock,
            category,
            status
        });

        if (files.photo) {
            const photo = files.photo[0]; // Access the first photo object inside the array
            console.log("Photo:", photo);

            if (!photo.filepath || !photo.mimetype) {
                return res.status(400).json({
                    error: "Invalid file data"
                });
            }

            if (photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1MB in size"
                });
            }

            try {
                product.photo.data = fs.readFileSync(photo.filepath);
                product.photo.contentType = photo.mimetype;
            } catch (readError) {
                console.error("File read error:", readError);
                return res.status(400).json({
                    error: 'Error reading the file',
                    details: readError.message
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
                error: errorHandler(saveErr)
            });
        }
    });
};
