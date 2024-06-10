const Category = require("../models/category");
const Sub_Category = require("../models/subCategory");

const { errorHandler } = require("../helpers/dbErrorHandler");


exports.create = async (req, res) => {
  try {
    const data = new Category(req.body);
    await data.save();
    res.json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.categoryById = async(req, res, next, id) => {
    try {
        const category = await Category.findById(id)
        if(!category){
            return res.status(400).json({ error: 'That Category is not found' });
        }
        req.category =  category
        next()
        
    } catch (error) {
        console.error('Error in Category Id', error);
        return res.status(500).json({ error: 'Something went wrong' });
  
        
    }
};

exports.read_Category = (req, res)=>{
    return res.json(req.category)
}

exports.update_cat = async(req, res)=>{
  try {

    const category = req.category
    console.log(category);
    if (!category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }
    category.name = req.body.name, 
    console.log("----------------------------------", category.name);
    const updated_category =await category.save()
    if(!updated_category){
      return res.status(400).json({
        error: "Invalid Data"
    });
    }
    console.log("**********************************", updated_category);
    res.json({
      message: "Category updated successfully",
      category: updated_category,
    });
  } catch (error) {
    console.log("error*********************", error);
    res.status(400).json({
      error: errorHandler(error),
    });
  }
}

exports.del_cat= async(req, res)=>{
 try {
  const category = req.category
  const del_Category = await category.deleteOne()
  if(!del_Category){
    return res.status(400).json({
        error: errorHandler(erroor)
    })
   }

   res.json({"message":"Product successfuly deleted"})


  
 } catch (error) {
  res.status(400).json({
    error: errorHandler(err),
  });
  
 }
}

exports.cat_List = async (req, res) => {
  try {
    console.log("Fetching category list");
    const categories = await Category.find();
    if (!categories) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    res.json({
      categories,
    });
  } catch (error) {
    res.status(400).json({
      error: errorHandler(error),
    });
  }
};




// SUB- CATEGORRY
exports.create_Sub_cat = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const parent_Cat = await Category.findById(categoryId);
    if (!parent_Cat) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    const sub_CatData = new Sub_Category({
      name: name,
      category: categoryId,
    });
    await sub_CatData.save();
    parent_Cat.subcategories.push(sub_CatData._id);

    parent_Cat.save();
    res.json({
      sub_CatData,
    });
  } catch (error) {
    res.status(400).json({
      error: errorHandler(error),
    });
  }
};

exports.sub_CategoryById = async (req, res, next, id) => {
    try {
        const sub_Category = await Sub_Category.findById(id)
        if(!sub_Category){
            return res.status(400).json({ error: 'That Category is not found' });
        }
        req.sub_category =  sub_Category
        next()
        
    } catch (error) {
        console.error('Error in Category Id', error);
        return res.status(500).json({ error: 'Something went wrong' });
  
        
    }
};

exports.read_Sub_Category = (req, res)=>{
    return res.json(req.sub_category)
}

exports.update_Sub_cat = async (req, res) => {
  try {
       console.log("update sub category");
    const sub_Categories = req.sub_category;
    console.log(sub_Categories);
    if (!sub_Categories) {
      return res.status(404).json({
        error: "Sub-category not found",
      });
    }

    sub_Categories.name = req.body.name;
    sub_Categories.category = req.body.category

    
    const updated_category = await sub_Categories.save();
    if (!updated_category) {
      
      return res.status(400).json({
        error: "Invalid data or failed to update",
      });
    }

    res.json({
      message: "Sub-category updated successfully",
      category: updated_category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: errorHandler(error),
    });
  }
};

exports.del_Sub_Cat= async(req, res)=>{
 try {
  const category = req.sub_category
  const del_Category = await category.deleteOne()
  if(!del_Category){
    return res.status(400).json({
        error: errorHandler(erroor)
    })
   }

   res.json({"message":"Product successfuly deleted"})


  
 } catch (error) {
  console.log(error);
  res.status(400).json({
    error: errorHandler(error),
  });
  
 }
}

exports.sub_Cat_List= async(req, res)=>{
  try {
    const categories = await Sub_Category.find()
    console.log(categories);
    if(!categories){
        return res.status(400).json({
          error: errorHandler(erroor)
        })
    }
    res.json({
      categories
    })
  } catch (error) {
    res.status(400).json({
      error: errorHandler(err),
    });
    
  }
  
}

