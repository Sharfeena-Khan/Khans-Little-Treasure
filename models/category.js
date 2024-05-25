const mongoose = require("mongoose");

const categorySchema= new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique : true,
      required: true,
    },
    subcategories: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Subcategory" 
      }],
  
  },
  { timestamps: true }
);


module.exports = mongoose.model("Category", categorySchema);
