import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { User } from "../modules/auth/auth.model.js";
import { Product } from "../modules/products/products.model.js";
import { Category } from "../modules/categories/categories.model.js";
import { Attribute } from "../modules/attributes/attributes.model.js";
import { Cart } from "../modules/cart/cart.model.js";
import { Order } from "../modules/orders/orders.model.js";

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
    "Lighting",
    "Consumer Durables",
    "Home and Kitchenware",
    "Tools",
    "Paints",
    "Bath & Sanitary",
    "Tiles & Flooring",
    "Digital Locks & Safes",
    "Hardware",
    "Kitchen & Sink",
    "Plywood & Laminates",
    "MDF & HDF",
    "Doors & WIndows",
    "Home Decor",
  ];
  const categories = [];
  for (let i = 0; i < 14; i++) {
    const category = new Category({
      name: defaultCategories[i],
      description: faker.lorem.sentence(),
    });
    categories.push(category);
  }

  const savedCategories = await Category.insertMany(categories);
  console.log("Category data seeded successfully");
  return savedCategories;
};

export const seedAttributes = async () => {
  await Attribute.deleteMany({});

  const attributes = [];

  for (let i = 0; i < 7; i++) {
    const attributeName = faker.commerce.productMaterial().toLowerCase();
    const attributeValues = Array.from(
      { length: faker.number.int({ min: 2, max: 5 }) },
      () => faker.color.human().toLowerCase()
    );

    attributes.push({
      name: attributeName,
      values: attributeValues,
    });
  }
  const savedAttributes = await Attribute.insertMany(attributes);
  console.log("Attribute data seeded successfully");

  return savedAttributes;
};

export const seedProducts = async () => {
  try {
    await seedUsers();
  } catch (error) {
    console.log(error);
  }
  try {
    await seedAttributes();
  } catch (error) {
    console.log(error);
  }
  const categories = await seedCategories();
  await Product.deleteMany({});

  const products = [];
  for (let i = 0; i < 20; i++) {
    const price = faker.commerce.price({ dec: 0 });
    const product = new Product({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      basePrice: price,
      currentPrice: price,
      sku: faker.vehicle.vin(),
      stock: faker.number.int({ min: 1, max: 100 }),
      categoryId: categories[i % categories.length]._id,
    });
    products.push(product);
  }

  const savedProducts = await Product.insertMany(products);
  console.log("Product data seeded successfully");
  return savedProducts;
};

export const seedCollections = async (
  productIds: string[],
  numCollections = 1
) => {
  const collections = [];

  for (let i = 0; i < numCollections; i++) {
    // Generate a random collection name and description
    const collectionName = faker.commerce.department().toLowerCase(); // Example: "Winter"
    const collectionDescription = `${collectionName} collection`;

    // Select a random subset of product IDs for the collection
    const numProducts = faker.number.int({ min: 1, max: productIds.length });
    const selectedProducts = faker.helpers.arrayElements(
      productIds,
      numProducts
    );

    collections.push({
      name: collectionName,
      description: collectionDescription,
      products: selectedProducts,
    });
  }

  return collections;
};

export const seedCartsAndOrder = async () => {
  const products = await seedProducts();
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
