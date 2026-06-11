import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
   name: {
       type: String,
       minlength: 3,
       maxlength: 20,
       required: [true, "category name is required"] 
    },
  slug:  {
      type: String,
       minlength: 3,
       maxlength: 20,
       required: [true, "category slug is required"] 
    },
    roomId:{
     type: mongoose.Schema.Types.ObjectId,
     ref: "rooms"
    },

   image: {
     type: String
    },
  status:  {
     type: Boolean,
     default: true
    }
},
    {
        timestamps: true
    }
)

  const CategoryModel = mongoose.model("catagories", categorySchema);
  export default CategoryModel