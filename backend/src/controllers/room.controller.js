import RoomModel from "../model/room.model.js"
import { sendBadRequest,
   sendConflict,
  sendCreated,
  sendNotFound,
  sendServerError,
sendSuccess ,
 } from "../utils/response.js"


const get = async (req, res) => {
    try {

        const rooms = await RoomModel.find();
        return res.status(200).json({
            success: true,
            message: "Data find",
            rooms: rooms
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const getById = async (req, res) => {
    try {
      const { id } = req.params;

        const rooms = await RoomModel.findById(id)
        return res.status(200).json({
            success: true,
            message: "Data find",
            rooms: rooms
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const create = async (req, res) => {
      try {
     const { name, slug } = req.body;
     const room_type = await RoomModel.findOne({ name });
     if (room_type) return sendConflict(res);

     await RoomModel.create({ name, slug });
     sendCreated(res)
   
   } catch (error) {
      sendServerError(res, "internal server error")
   }
}

  const deleteById = async (req, res) => {
      try {
     const { id } = req.params;
     const room_type = await RoomModel.findById(id);
     if (!room_type) return sendBadRequest(res);
     await RoomModel.findByIdAndDelete(id)
     
     sendSuccess(res, "Delete Sucessfully")
   
   } catch (error) {
      sendServerError(res, "internal server error")
   }
}

 const StatusUpdate = async (req, res) => {
      try {
     const { id } = req.params;
     const room_type = await RoomModel.findById({ _id: id});
     if (!room_type) return sendNotFound(res);
     await RoomModel.findByIdAndUpdate(
      { _id: id },
      {
      $set: {
         status: !room_type.status
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