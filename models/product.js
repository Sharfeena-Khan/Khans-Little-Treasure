const mongoose = require('mongoose')
const { ObjectId } = require("mongodb")

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
    category: {
        type: ObjectId, // Change the type to String to store the category name
        ref: 'subCategory',
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
        

})

module.exports = mongoose.model("Product", productSchema)