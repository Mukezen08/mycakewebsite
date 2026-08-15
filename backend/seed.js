const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const products = [
  {
    "name": "Heart-Shaped Classic Brownie",
    "description": "Pure dark chocolate love baked in a romantic heart shape. Intensely fudgy crust, moist interior.",
    "category": "classic",
    "price": 350,
    "image": "i1",
    "badge": "Signature",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Assorted Gourmet Brownie Box",
    "description": "Six premium brownies — nuts, matcha drizzle, dark ganache, all on rich fudge bases.",
    "category": "gourmet",
    "price": 650,
    "image": "i2",
    "badge": "Best Seller",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Matcha & Dark Chocolate Brownie",
    "description": "Earthy matcha meets intense dark chocolate. Feather-pattern matcha drizzle on rich dark base.",
    "category": "gourmet",
    "price": 380,
    "image": "i3",
    "badge": "New",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Mixed Flavour Collection",
    "description": "Six exquisite brownies — matcha-cashew, dark ganache, nut medley, raisin chocolate.",
    "category": "gourmet",
    "price": 620,
    "image": "i4",
    "badge": "Popular",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Strawberry Rose Birthday Brownie",
    "description": "Niru's Pastry signature heart-shaped sponge with pink buttercream and dried rose petals.",
    "category": "signature",
    "price": 550,
    "image": "i5",
    "badge": "Birthday",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Pink Rose Birthday Cake",
    "description": "Tall dramatic heart cake with Happy Birthday topper, pink buttercream rosettes, cascading rose petals.",
    "category": "custom",
    "price": 600,
    "image": "i6",
    "badge": "Custom",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Anniversary Heart Brownie Cake",
    "description": "Heart-shaped with layered pink frosting, cream piping, and dried rose petals. Perfect for anniversaries.",
    "category": "custom",
    "price": 580,
    "image": "i7",
    "badge": "Anniversary",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Celebration Heart Cake",
    "description": "Premium heart-shaped blondie with pink cream edges and rose petal garnish.",
    "category": "custom",
    "price": 560,
    "image": "i8",
    "badge": "Gift",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Artisan Batter Process",
    "description": "The vibrant coloured batters before transformation — red, green, vanilla tones in heart moulds.",
    "category": "process",
    "price": 0,
    "image": "i9",
    "badge": "Process",
    "stock": 20,
    "featured": false,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Classic Brownie Gift Boxes",
    "description": "Two gorgeous floral gift boxes with freshly baked brownies and Niru's handwritten thank-you card.",
    "category": "gift",
    "price": 450,
    "image": "i10",
    "badge": "Gift Box",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Birthday Cashew Brownie Cake",
    "description": "Rich round brownie with chocolate ganache, whole cashews, and golden Happy Birthday topper.",
    "category": "signature",
    "price": 520,
    "image": "i11",
    "badge": "Birthday",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Royal Cashew Brownie Cake",
    "description": "Circular brownie with dark chocolate feather piping, gold pearl accents, cashew border.",
    "category": "signature",
    "price": 700,
    "image": "i12",
    "badge": "Premium",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Classic Gold Pearl Brownies",
    "description": "Pure shiny crinkle-top brownie squares with tasteful gold pearl decoration. The gold standard.",
    "category": "classic",
    "price": 280,
    "image": "i13",
    "badge": "Classic",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Fudge Brownie Squares",
    "description": "Fresh-from-oven fudge brownie slices — dense, glossy-topped, the essence of perfect chocolate baking.",
    "category": "classic",
    "price": 260,
    "image": "i14",
    "badge": "Fresh",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Caramel Swirl Brownie",
    "description": "Luxurious caramel-swirled brownie in individual packaging — perfect single-serve indulgence.",
    "category": "classic",
    "price": 180,
    "image": "i15",
    "badge": "Single Serve",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Caramel Marble Brownie Box",
    "description": "Individual caramel-marble brownies in clear presentation boxes — beautiful gifting option.",
    "category": "classic",
    "price": 160,
    "image": "i16",
    "badge": "Packaged",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Dark Caramel Brownie",
    "description": "Close-up masterpiece — deep dark chocolate with golden caramel swirls and scattered gold pearls.",
    "category": "classic",
    "price": 200,
    "image": "i17",
    "badge": "Artisan",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Cashew Ganache Brownie Cake",
    "description": "Round brownie with glossy dark ganache, gold pearls in geometric pattern, ring of crushed cashews.",
    "category": "signature",
    "price": 680,
    "image": "i18",
    "badge": "Signature",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0
  },
  {
    "name": "Premium Dark Brownie Cake",
    "description": "Showstopper round cake — dark chocolate ganache feather-piped to perfection with cashew border.",
    "category": "signature",
    "price": 720,
    "image": "i19",
    "badge": "Premium",
    "stock": 20,
    "featured": true,
    "rating": 0,
    "reviews": 0    
  }
];

const importData = async () => {
    try {

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log("✅ Products Imported Successfully");

        process.exit();

    } catch (error) {

        console.error("❌ Error importing products");
        console.error(error);

        process.exit(1);
    }
};

importData();
