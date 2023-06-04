const mongoose = require("mongoose");
const productSchema = require("../schemas/product.schema");
mongoose.model(process.env.MONGOOSE_MODEL_PRODUCT, productSchema, process.env.MONGOOSE_COLLECTION_PRODUCT);
 