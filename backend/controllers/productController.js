        const Product=require("../models/Product");

        // Get all products
        const getProducts=async(req,res)=>{
            try{
                const products=await Product.find();
                res.status(200).json(products);
            }
            catch(error){
                res.status(500).json({message:error.message});
            }
        };

        // Get product by id
        const getProductById=async(req,res)=>{
            try{

                const product=await Product.findById(req.params.id);

                if(!product){
                    return res.status(404).json({message:"Product not found"});
                }

                res.status(200).json(product);

            }
            catch(error){
                res.status(500).json({message:error.message});
            }
        };

        // Add Product
        const addProduct=async(req,res)=>{

            try{

                const product=new Product(req.body);

                await product.save();

                res.status(201).json({
                    message:"Product Added Successfully",
                    product
                });

            }
            catch(error){

                res.status(500).json({
                    message:error.message
                });

            }

        };

        // Update Product

        const updateProduct=async(req,res)=>{

            try{

                const product=await Product.findByIdAndUpdate(

                    req.params.id,
                    req.body,
                    {new:true}

                );

                if(!product){

                    return res.status(404).json({
                        message:"Product Not Found"
                    });

                }

                res.status(200).json(product);

            }

            catch(error){

                res.status(500).json({
                    message:error.message
                });

            }

        };

        // Delete Product

        const deleteProduct=async(req,res)=>{

            try{

                const product=await Product.findByIdAndDelete(req.params.id);

                if(!product){

                    return res.status(404).json({
                        message:"Product Not Found"
                    });

                }

                res.status(200).json({
                    message:"Product Deleted Successfully"
                });

            }

            catch(error){

                res.status(500).json({
                    message:error.message
                });

            }

        };
        // Update Product Stock
const updateProductStock = async (req, res) => {
    try {

        const { stock } = req.body;

        if (stock === undefined || stock === null || stock < 0) {
            return res.status(400).json({
                message: "Valid stock quantity is required"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                stock: Number(stock)
            },
            {
                new: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product Not Found"
            });
        }

        res.status(200).json({
            message: "Stock updated successfully",
            product
        });

    } catch (error) {

        console.error("Update stock error:", error);

        res.status(500).json({
            message: error.message
        });

    }
};

        module.exports={
            getProducts,
            getProductById,
            addProduct,
            updateProduct,
            deleteProduct,
            updateProductStock
        };