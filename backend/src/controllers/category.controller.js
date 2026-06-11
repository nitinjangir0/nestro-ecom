import CategoryModel from "../model/category.model.js"
import { sendBadRequest,
   sendConflict,
  sendCreated,
  sendNotFound,
  sendServerError,
sendSuccess ,
 } from "../utils/response.js"


const get = async (req, res) => {
    try {

        const categories = await CategoryModel.find();
        return res.status(200).json({
            success: true,
            message: "Data find",
            categories
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const getById = async (req, res) => {
    try {
      const { id } = req.params;

        const category = await CategoryModel.findById(id)
        return res.status(200).json({
            success: true,
            message: "Data find",
            category: category
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const create = async (req, res) => {
    
      try {

     const { name, slug , roomId} = req.body;
     
// cliudinary Image URL
     const image = req.file.path;
     console.log(req.file);

     const category = await CategoryModel.findOne({ name });
     if (category) return sendConflict(res);

     await CategoryModel.create({ name, slug, image, roomId, image});
     sendCreated(res);
   
   } catch (error) {
        console.log(error, "error");
   sendServerError(res, "Internal Server Error");
   }
}

  const deleteById = async (req, res) => {
      try {
     const { id } = req.params;
     const category = await CategoryModel.findById(id);
     if (!category) return sendBadRequest(res);
     await CategoryModel.findByIdAndDelete(id)
     
     sendSuccess(res, "Delete Sucessfully")
   
   } catch (error) {
      sendServerError(res, "internal server error")
   }
}

 const StatusUpdate = async (req, res) => {
      try {
     const { id } = req.params;
     const category = await CategoryModel.findById(id);
     if (!category) return sendBadRequest(res);
     await CategoryModel.findByIdAndUpdate(
      { _id: id },
      {
      $set: {
         status: !category.status
      }   
      }
   )
     
     sendSuccess(res, "Data Upadate Sucessfully")
   
   } catch (error) {
      sendServerError(res, "internal server error")
   }
}
 export {
    get,
    create,
    StatusUpdate,
    deleteById,
    getById

 }