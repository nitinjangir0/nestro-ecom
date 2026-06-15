import ProductModel from "../model/product.model.js";
import CategoryModel from "../model/category.model.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"
const get = async (req, res) => {
    try {
       const products = await ProductModel.find().populate([
        {
            path: "roomId",
            select: "_id name slug"
        },
         {
            path: "categoryId",
            select: "_id name slug"
        }
       ]);
        return res.status(200).json({
            success: true,
            message: "Data find",
            products
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id)
        return res.status(200).json({
            success: true,
            message: "Data find",
            product 
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const create = async (req, res) => {
    try {

        const {
            roomId,
            categoryId,
            name,
            slug,
            originalPrice,
            salePrice,
            discount,
            shortDescription,
            description,
            material,
            color,
            weight,
            width,
            height,
            depth,
            seoTitle,
            seoDescription
        } = req.body;
console.log(req.body)

      //Image URL
      const thumbnail = req.file?.path || "";

      //check products exists
      const product = await ProductModel.findOne({
        $or: [
            {slug},
            {name}
        ]
      });

      if (product) {
        return sendConflict(
            res,
            "product already exists"
        );
      }
       
      await ProductModel.create({
        roomId,
        categoryId,

        name,
        slug,

        originalPrice,
        salePrice,
        discount,

        shortDescription,
        description,

        material,

        dimensions: {
            width,
            height,
            depth
        },

        weight,

        color,

        seoTitle,
        seoDescription,

        thumbnail
      })

      sendCreated(
        res,
        "product created successfully"
      );
    } catch (error) {

        console.log(error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};

const update = async (req, res) => {

    try {

        const { id } = req.params;

        const { name, slug, roomId } = req.body;

        // =========================
        // Check Category Exists
        // =========================
        const oldCategory = await CategoryModel.findById(id);

        if (!oldCategory) {
            return sendNotFound(res, "Category not found");
        }

        // =========================
        // Duplicate Name Check
        // =========================
        const categoryExists = await CategoryModel.findOne({ name });

        if (categoryExists) {
            return sendConflict(res, "Category already exists");
        }

        // =========================
        // Update Object
        // =========================
        const updateData = {
            name,
            slug,
            roomId
        };

        // =========================
        // If New Image Uploaded
        // =========================
        if (req.file) {

            // Cloudinary URL
            updateData.image = req.file.path;
        }

        // =========================
        // Update Category
        // =========================
        await CategoryModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true
            }
        );

        return sendSuccess(
            res,
            "Category updated successfully"
        );

    }
    catch (error) {

        console.log(error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};

//Wood



const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById({ _id: id });
        if (!category) return sendNotFound(res);
        await CategoryModel.findByIdAndDelete(id)

        sendSuccess(res, "Delete Sucessfully")

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const StatusUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById({ _id: id });
        if (!category) return sendNotFound(res);
        await CategoryModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    status: !category.status
                }
            }

        )

        sendSuccess(res, "Data Update Sucessfully")

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

const StatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const { flag } = req.body;
        const product = await ProductModel.findById({ _id: id });
        if (!product) return sendNotFound(res);
        


        await ProductModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    [flag]: !product[flag]
                }
            }

        )

        sendSuccess(res, "Status Update Sucessfully")

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

export {
    get,
    create,
    StatusUpdate,
    deleteById,
    getById,
    update,
    StatusById
}