const express = require("express");
const router = express.Router();

const {
  create,
  categoryById,
  read_Category, 
  update_cat,
  del_cat,
  cat_List,

  // Sub Category
  sub_CategoryById, 
  read_Sub_Category,
  create_Sub_cat,  
  update_Sub_cat,
  del_Sub_Cat,
  sub_Cat_List


} = require("../controller/category");
const { requireSignin, isAdmin, isAuth } = require("../controller/auth");
const { userById } = require("../controller/user");


// Main Category Routes
router.get("/category/:categoryById", read_Category);
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
  "/category/:categoryById/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update_cat
);
router.delete(
  "/category/:categoryById/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  del_cat
);
router.get("/categories", cat_List);


// Sub-Category Routes
router.get("/category/sub/:sub_CategoryById", read_Sub_Category);
router.post(
  "/category/create_Sub_cat/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  create_Sub_cat
);

router.put(
  "/category/sub/:sub_CategoryById/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update_Sub_cat
);
router.delete(
  "/category/sub/:sub_CategoryById/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  del_Sub_Cat
);
router.get("/subCategories", sub_Cat_List);

router.param("categoryById", categoryById);
router.param("sub_CategoryById", sub_CategoryById);
router.param("userId", userById);


module.exports = router;
