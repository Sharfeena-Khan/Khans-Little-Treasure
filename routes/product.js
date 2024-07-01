const express = require("express");
const router = express.Router();

const {
  create,
  productById,
  read,
  remove,
  updatePdt,
  list,
  listRelated,
  listCategorise, 
  list_Sub_Categorise,
  listBySearch,
  photo
} = require("../controller/product");
const { requireSignin, isAdmin, isAuth } = require("../controller/auth");
const { userById } = require("../controller/user");
// const { update } = require("lodash")

// CRUD OPREATION
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/product/:productId", read);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  updatePdt
);

// PRODUCTS BY SELL AND ARRIVAL ON REQUEST QUERY PARAMS
router.get("/products", list);

// LIST RELATED PRODUCTS
router.get("/products/related/:productId", listRelated)

// LIST PRODUCT CATEGORIES
router.get("/products/categorise", listCategorise)

// LIST PRODUCT SubCATEGORIES
router.get("/products/Subcategorise", list_Sub_Categorise)

// list products by search
router.post("/products/by/search", listBySearch)

// Get product Photo
router.get("/products/photo/:productId", photo)



router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
