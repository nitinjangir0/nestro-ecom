import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
   name: {
       type: String,
       minlength: 3,
       maxlength: 20,
       required: [true, "category name is required"],
       unique: true 
    },
  slug:  {
      type: String,
       minlength: 3,
       maxlength: 20,
       required: [true, "category slug is required"], 
       unique: true 
    },
  status:  {
     type: Boolean,
     default: true
    }
},
    {
        timestamps: true,
        autoIndex: true
    }
)

 const RoomModel = mongoose.model("rooms", roomSchema);
  export default RoomModel;