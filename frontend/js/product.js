const API = "http://localhost:5000/api/products";

async function loadProducts() {
    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        console.log("Products from MongoDB:", products);

        // Convert backend "image" field to frontend "img" field
        const formattedProducts = products.map(product => ({
            ...product,
            img: product.image
        }));

        console.log("Formatted products:", formattedProducts);

        displayProducts(formattedProducts);

    } catch (error) {

        console.error("Product loading error:", error);

    }
}

loadProducts();