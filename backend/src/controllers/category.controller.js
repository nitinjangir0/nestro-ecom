import CategoryModel from "../model/category.model.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"
import ProductModel from "../model/product.model.js";

const get = async (req, res) => {
    try {
        const query = req.query;
        const filter = {};
        const limit = query.limit ? parseInt(query.limit) : 0;

        if (query.status) filter.status = query.status === "true";

        const categories = await CategoryModel.find(filter).limit(limit);

        const categoryWithCount = await Promise.all(
            categories.map(async (category) => {

                const productCount = await ProductModel.countDocuments({
                    categoryId: category._id,
                    status: true
                });

                return {
                    ...category.toObject(),
                    productCount
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "Data find",
            categories: categoryWithCount
        });

    } catch (error) {
        console.log(error);
        sendServerError(res, "Internal Server Error");
    }
};

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

        const { name, slug } = req.body;

        // Cloudinary Image URL
        const image = req.file.path;
        console.log(image, "IMAGE")
        const category = await CategoryModel.findOne({ name });
        if (category) return sendConflict(res);
        await CategoryModel.create({ name, slug, image, image });
        sendCreated(res);

    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }

}

const update = async (req, res) => {
    try {

        const { id } = req.params;

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

        // Check Product Exists
        const product = await ProductModel.findById(id);

        if (!product) {
            return sendNotFound(res, "Product not found");
        }

        // Duplicate Name / Slug Check
        const exists = await ProductModel.findOne({
            _id: { $ne: id },
            $or: [
                { name },
                { slug }
            ]
        });

        if (exists) {
            return sendConflict(
                res,
                "Product with same name or slug already exists"
            );
        }

        const updateData = {
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

            dimensions: {
                width,
                height,
                depth
            },

            seoTitle,
            seoDescription
        };

        // Update Thumbnail Only If Uploaded
        if (req.file) {
            updateData.thumbnail = req.file.path;
        }

        await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        return sendSuccess(
            res,
            "Product Updated Successfully"
        );

    } catch (error) {

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

export {
    get,
    create,
    StatusUpdate,
    deleteById,
    getById,
    update
}