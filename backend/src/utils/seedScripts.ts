import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { User } from "../modules/auth/auth.model.js";
import { Product } from "../modules/products/products.model.js";
import { Category } from "../modules/categories/categories.model.js";
import { Attribute } from "../modules/attributes/attributes.model.js";
import { Cart } from "../modules/cart/cart.model.js";
import { Order } from "../modules/orders/orders.model.js";
import { InventoryHistory } from "../modules/inventory/inventory.model.js";

export const seedUsers = async () => {
  // Clear existing users
  await User.deleteMany({});

  const hashedAdminPassword = await bcrypt.hash("password", 10);

  // Create an admin user with predefined credentials
  const adminUser = new User({
    email: "admin@admin.com",
    password: hashedAdminPassword,
    role: "ADMIN",
    firstName: "Admin",
    lastName: "User",
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
  });

  const testUser = new User({
    email: "test@test.com",
    password: hashedAdminPassword,
    role: "USER",
    firstName: "Test",
    lastName: "User",
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
  });

  // Create a few vendor and user entries
  const users = [adminUser, testUser];
  const roles = ["VENDOR", "USER", "USER_PRO"];

  for (let i = 0; i < 10; i++) {
    const role = roles[i % roles.length];
    const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);
    const user = new User({
      email: faker.internet.email(),
      password: hashedPassword,
      role,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      address: faker.location.streetAddress(),
    });
    users.push(user);
  }

  // Save all users to the database
  await User.insertMany(users);
  console.log("User data seeded successfully");
};

export const seedCategories = async () => {
  await Category.deleteMany({});
  const defaultCategories = [
    {
      _id: "64c59a459e5e3b33d1baf1a3",
      name: "Lighting",
      description:
        "Antiquus addo thesis trans curto defaeco deserunt strues beatus.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1a4",
      name: "Consumer Durables",
      description: "Similique facere crinis tricesimus corona claudeo.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1a5",
      name: "Home and Kitchenware",
      description: "Causa complectus consectetur libero.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1a6",
      name: "Tools",
      description: "Centum sum sordeo vicinus.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1a7",
      name: "Paints",
      description:
        "In strues tum casso tenetur patior itaque voco patria vivo.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1a8",
      name: "Bath & Sanitary",
      description:
        "Complectus recusandae decipio volaticus testimonium fuga beatae deorsum cruciamentum.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1a9",
      name: "Tiles & Flooring",
      description:
        "Voluptatibus absorbeo utrimque adnuo varietas usitas adhuc decipio odit.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1b0",
      name: "Digital Locks & Safes",
      description:
        "Adfectus caute cultura demens alius clementia urbanus umerus deduco adipiscor.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1b1",
      name: "Hardware",
      description: "Argentum tantillus tergum ustulo quis accusantium collum.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1b2",
      name: "Kitchen & Sink",
      description: "Solum auxilium tabula.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1b3",
      name: "Plywood & Laminates",
      description: "Copia corrupti consectetur.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1b4",
      name: "MDF & HDF",
      description: "Aequitas adiuvo acceptus depulso adopto adopto.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1b5",
      name: "Doors & WIndows",
      description:
        "Vorago triumphus natus vox vulgivagus abscido surgo amoveo crepusculum voco.",
    },
    {
      _id: "64c59a459e5e3b33d1baf1b6",
      name: "Home Decor",
      description:
        "Nostrum cena vomito adinventitias coniecto absconditus quos.",
    },
  ];
  const categories = [];
  for (let i = 0; i < 14; i++) {
    const category = new Category({
      _id: defaultCategories[i]._id,
      name: defaultCategories[i].name,
      description: defaultCategories[i].description,
    });
    categories.push(category);
  }

  const savedCategories = await Category.insertMany(categories);
  console.log("Category data seeded successfully");
  return savedCategories;
};

export const seedAttributes = async () => {
  await Attribute.deleteMany({});

  const attributes = [
    { name: "brand", values: ["bajaj", "havels", "sony"] },
    { name: "color", values: ["blue", "red", "yellow"] },
    { name: "size", values: ["xl", "l", "m"] },
  ];

  const savedAttributes = await Attribute.insertMany(attributes);
  console.log("Attribute data seeded successfully");

  return savedAttributes;
};

export const seedProducts = async () => {
  try {
    await seedUsers();
  } catch (error) {
    console.error(error);
  }
  try {
    await seedAttributes();
  } catch (error) {
    console.error(error);
  }
  const categories = await seedCategories();
  await Product.deleteMany({});

  const products = [];
  for (let i = 0; i < 15; i++) {
    const price = faker.commerce.price({ dec: 0 });
    const product = new Product({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      basePrice: price,
      currentPrice: price,
      sku: faker.vehicle.vin(),
      stock: faker.number.int({ min: 1, max: 100 }),
      categoryId: categories[i % categories.length]._id,
      attributes: { brand: "bajaj", color: "red", size: "l" },
    });
    products.push(product);
  }

  const savedProducts = await Product.insertMany(products);
  console.log("Product data seeded successfully");
  return savedProducts;
};

export const seedInventoryHistory = async () => {
  try {
    const products = await Product.find();
    const inventoryItems = [];
    for (let i = 0; i < products.length; i++) {
      const inventoryItem = {
        productId: products[i]._id,
        quantityChanged: products[i].stock,
        quantityTotal: products[i].stock,
        type: "PURCHASE",
      };
      inventoryItems.push(inventoryItem);
    }
    const savedInventory = await InventoryHistory.insertMany(inventoryItems);
    console.log("Inventory data seeded successfully");
    return savedInventory;
  } catch (error) {
    console.error(error);
  }
};

export const seedCartsAndOrder = async () => {
  const products = await seedProducts();
  await seedInventoryHistory();
  const productIds = products.map((item) => item._id);

  const carts = [];
  const orders = [];
  const user = await User.findOne({ email: "test@test.com" });
  if (!user) return;

  const userId = user._id;
  for (let i = 0; i < 6; i++) {
    const productId = faker.helpers.arrayElement(productIds);
    const quantity = faker.number.int({ min: 1, max: 10 });

    carts.push({
      userId,
      productId,
      quantity,
    });
  }
  await Cart.deleteMany({});
  await Cart.insertMany(carts);
  console.log("Cart data seeded");

  for (let i = 0; i < 7; i++) {
    const numOrderItems = faker.number.int({ min: 1, max: 5 });
    const orderItems = Array.from({ length: numOrderItems }, () => ({
      productId: faker.helpers.arrayElement(productIds),
      quantity: faker.number.int({ min: 1, max: 10 }),
      priceAtTime: faker.number.int({ min: 100, max: 500 }),
    }));
    const deliveryAddress = `${faker.location.streetAddress()}, ${faker.location.city()}`;
    const phoneNumber = faker.phone.number();

    orders.push({
      userId,
      orderItems,
      deliveryAddress,
      phoneNumber,
    });
  }
  await Order.deleteMany({});
  await Order.insertMany(orders);
  console.log("Order data seeded");

  return;
};
