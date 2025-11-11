import Product from "../models/Products.js";
import cloudinary from "../config/cloudinary.js"
import mongoose from "mongoose"

export const createProduct = async (req, res) => {
    try{
        if(!req.file) {
            return res.status(400).json({error: "Image file is required"})
        }

        //Upload to cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "Productss"
        });

        const {name, category, description, quantity, oldPrice, newPrice} = req.body

        const newProduct = new Product({
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            name,
            quantity,
            description,
            category,
            oldPrice,
            newPrice
        });
        
        const savedProduct = await newProduct.save()
        res.status(201).json(savedProduct)

    } catch (err) {
        console.error("Error creating art, err");
        res.status(500).json({err: err.message})
    }
};


export const getProduct = async (req, res) => {
    try{
        const products = await Product.find().sort ({createdAt: -1})
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const getProductById = async (req,res) => {
    try{
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(403).json({error: "Invalid Object ID."})
        }
        const getbyId = await Product.findById(req.params.id)
        if(!getbyId) return res.status(404).json({error: "Not found."})
        res.status(201).json(getbyId)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}


export const updateProduct = async (req, res) => {
    try{
        const {name, description, category, quantity, oldPrice, newPrice} = req.body
        const updates = {name, description, category, quantity, oldPrice, newPrice};
        if(req.file) {
            const products = await Product.findById(req.params.id);
            if(!products) return res.status(404).json({error: "Not found"})
        if(products.publicId) {
            await cloudinary.uploader.destroy(products.publicId)
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "Productss",
        });

        updates.image = uploadResult.secure_url;
        updates.publicId = uploadResult.public_id
        }
        const products = await Product.findByIdAndUpdate(req.params.id, updates, {new: true, runValidators: true});

        if(!products) return res.status(404).json({error: "Not found"});
        res.json(products)
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const deleteProduct = async (req, res) => {
    try{
        const products = await Product.findByIdAndDelete(req.params.id);
        if(!products) return res.status(404).json({error: "Not found"});

        if(products.publicId) {
            await cloudinary.uploader.destroy(products.publicId)
        }
        await products.deleteOne();
        res.json({message: "Deleted successfully"})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// READ USER’S ARTWORKS
export const getUserArtworks = async (req, res) => {
  console.log("req.auth.sub:", req.auth?.sub);
  console.log("req.params.auth0Id:", req.params.auth0Id);

  try {
    const { auth0Id } = req.params;

    // ✅ enforce ownership
    if (req.auth?.sub !== auth0Id) {
      return res.status(403).json({ message: "Forbidden: not your profile" });
    }

    const artworks = await Art.find({ auth0Id });
    res.status(200).json(artworks);
  } catch (err) {
    console.error("Error fetching user artworks:", err);
    res.status(500).json({ message: "Server error fetching user artworks" });
  }
};