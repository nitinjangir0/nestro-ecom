import ProductModel from "../model/product.model.js";
import CategoryModel from "../model/category.model.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"
import RoomModel from "../model/room.model.js"
import { model } from "mongoose";



const get = async (req, res) => {
    try {
        const query = req.query;

        const filter = {};
        const sortBy = {};

        // Pagination
        const page = Math.max(
            parseInt(query.page) || 1,
            1
        );

        const limit = Math.max(
            parseInt(query.limit) || 6,
            1
        );

        const skip = (page - 1) * limit;

        // Boolean Filters
        if (query.status !== undefined) {
            filter.status = query.status === "true";
        }

        if (query.stock !== undefined) {
            filter.stock = query.stock === "true";
        }

        if (query.bestSeller !== undefined) {
            filter.bestSeller = query.bestSeller === "true";
        }

        if (query.newArrival !== undefined) {
            filter.newArrival = query.newArrival === "true";
        }

        if (query.featured !== undefined) {
            filter.featured = query.featured === "true";
        }

        // Room Type Filter
        if (query.roomtype) {
            const roomtypeSlugs = query.roomtype
                .split(",")
                .filter(Boolean);

            const roomtypes = await RoomModel.find({
                slug: {
                    $in: roomtypeSlugs,
                },
            }).select("_id");

            const roomtypeIds = roomtypes.map(
                (roomtype) => roomtype._id
            );

            filter.roomId = {
                $in: roomtypeIds,
            };
        }

        // Category Filter
        if (query.category) {
            const categorySlugs = query.category
                .split(",")
                .filter(Boolean);

            const categories = await CategoryModel.find({
                slug: {
                    $in: categorySlugs,
                },
            }).select("_id");

            const categoryIds = categories.map(
                (category) => category._id
            );

            filter.categoryId = {
                $in: categoryIds,
            };
        }

        // Price Filter
        if (
            query.min !== undefined &&
            query.max !== undefined
        ) {
            const min = Number(query.min);
            const max = Number(query.max);

            filter.salePrice = {
                $gte: min,
                $lte: max,
            };
        }

        // Sort
        if (query.sort === "asc") {
            sortBy.salePrice = 1;
        } else if (query.sort === "desc") {
            sortBy.salePrice = -1;
        } else {
            sortBy.createdAt = -1;
        }

        // Fetch paginated products
        const products = await ProductModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .populate([
                {
                    path: "roomId",
                    select: "_id name slug",
                },
                {
                    path: "categoryId",
                    select: "_id name slug",
                },
            ]);

        // Total products according to applied filters
        const total = await ProductModel.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Data found",
            products,

            meta: {
                page,
                limit,
                total,
                skip,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.log("GET PRODUCTS ERROR:", error);

        return sendServerError(
            res,
            "Internal Server Error"
        );
    }
};
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id)
            .populate("roomId")
            .populate("categoryId");
        return res.status(200).json({
            success: true,
            message: "Data find",
            product
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}

// ===============================
// GET PRODUCT BY SLUG
// ===============================

export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Product slug is required"
            });
        }

        const product = await ProductModel
            .findOne({
                slug: slug,
                status: true
            })
            .populate("roomId")
            .populate("categoryId");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product,
            message: "Product fetched successfully"
        });

    } catch (error) {
        console.log("GET PRODUCT BY SLUG ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


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
                { slug },
                { name }
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

        const product = await ProductModel.findById(id);

        if (!product) {
            return sendNotFound(res, "Product not found");
        }

        const exists = await ProductModel.findOne({
            _id: { $ne: id },
            $or: [
                { name },
                { slug }
            ]
        });

        if (exists) {
            return sendConflict(res, "Product already exists");
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

        if (req.file) {
            updateData.thumbnail = req.file.path;
        }

        await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return sendSuccess(
            res,
            "Product updated successfully"
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
        const product = await ProductModel.findById({ _id: id });
        if (!product) return sendNotFound(res);
        await ProductModel.findByIdAndDelete(id)

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

const addImages = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);

        if (!product) {
            return sendNotFound(res);
        }

        if (!req.files || req.files.length === 0) {
            return sendServerError(res, "Please upload images");
        }

        const images = req.files
            .map(file => file.path)
            .filter(Boolean);

        product.images.push(...images);

        await product.save();

        return sendSuccess(res, "Images Updated Successfully");
    } catch (error) {
        console.log(error);
        return sendServerError(res, "Internal Server Error");
    }
};


// ===============================
// SEARCH PRODUCTS
// ===============================

const searchProducts = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search || !search.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required",
            });
        }

        const products = await ProductModel.find({
            status: true,
            $or: [
                {
                    name: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    material: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    color: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
            ],
        })
            .populate([
                {
                    path: "roomId",
                    select: "_id name slug",
                },
                {
                    path: "categoryId",
                    select: "_id name slug",
                },
            ])
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            message: "Search products fetched successfully",
            data: products,
        });
    } catch (error) {
        console.error("Search products error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while searching products",
            error: error.message,
        });
    }
};



export {
    get,
    create,
    StatusUpdate,
    deleteById,
    getById,
    update,
    StatusById,
    addImages,
    searchProducts
}