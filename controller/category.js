const Category = require("../models/category")
const Sub_Category =require("../models/subCategory")

const { errorHandler } = require("../helpers/dbErrorHandler")
const subCategory = require("../models/subCategory")

exports.create = async(req, res)=>{
    try {
        const data = new Category(req.body)
        await data.save()
        res.json({
            data
        })
        
    } catch (error) {
        res.status(400).json({
            error: errorHandler(err)})
             }
        
    
}

exports.create_Sub_cat = async(req, res)=>{
    try {
        const {name, categoryId } = req.body
        const parent_Cat = await Category.findById(categoryId)
        if(!parent_Cat){
            return res.status(400).json({
                error: "Category not found",
              });
            }
        const sub_CatData = new Sub_Category({
            name: name,
            category : categoryId
        })
        await sub_CatData.save()
        parent_Cat.subcategories.push(sub_CatData._id)

        parent_Cat.save()
        res.json({
            sub_CatData
        })
        
    } catch (error) {
        res.status(400).json({
            error: errorHandler(error),
          });
        
    }
}
