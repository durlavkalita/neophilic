import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
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
  const roles = ["VENDOR", "USER"];

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

  const categories = [];
  for (let i = 0; i < 5; i++) {
    const category = new Category({
      name: faker.commerce.department(),
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
  for (let i = 0; i < 10; i++) {
    const product = new Product({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      base_price: faker.commerce.price(),
      current_price: faker.commerce.price(),
      sku: faker.vehicle.vin(),
      currentStock: faker.number.int({ min: 1, max: 100 }),
      thumbnailId: faker.vehicle.vin(), // Placeholder for image ID
      category: categories[i % categories.length]._id, // Assign a category from the list
    });
    products.push(product);
  }

  await Product.insertMany(products);
  console.log("Product data seeded successfully");
};
