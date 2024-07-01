const mongoose = require('mongoose')
// const { ObjectId } = require("mongodb")
// const subCategory = require('./subCategory')

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,

    },
    description: {
        type:String,
        required:true,

    }, 
    price:{
        type: Number,
        required:true,
       

    },
   
     
    photo: {
        data: Buffer,
        contentType : String
    },
   
    stock:{
        type: Number,
        required:true,
        min : 0,
        max : 10

    },
    sold:{
        type: Number,
        default :0

    },
    mainCategory :{
        type: String, // Change the type to String to store the category name
        ref: 'Category',
        required : true

    },

    category: {
        type: String, // Change the type to String to store the category name
        ref: 'Sub_category',
        required : true
      },

    
    discountType:{
        type:String
    },
    discountPercentage:{
        type:String
    },
    status : {
        type: String,
        required : true
    },
    Orientation:  {
        type: String,
       
    },
    Size:  {
        type: String,
       
    },
    
   
    // active :{
    //     type : Boolean , 
    //     required : true,
    //     default :true
    // },
    // isDelete :{
    //     type : Boolean , 
    //     required : true,
    //     default :false
    // }
        

},
{ timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)