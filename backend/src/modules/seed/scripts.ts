import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { User } from "../auth/auth.model.js";
import { Product } from "../products/products.model.js";
import { Category } from "../categories/categories.model.js";

// Seed data for users
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

  // Create a few vendor and user entries
  const users = [adminUser];
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
  return savedCategories; // Return categories to link with products
};

export const seedProducts = async () => {
  // First, seed categories and get their IDs
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
      category: categories[i % categories.length]._id,
    });
    products.push(product);
  }

  await Product.insertMany(products);
  console.log("Product data seeded successfully");
};
