import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./../../src/config/db.config";
import request from "supertest";
import app from "../../src/app";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import mongoose, { ObjectId } from "mongoose";
import { Category } from "../../src/modules/categories/categories.model";
import { User } from "../../src/modules/auth/auth.model";
import { generateAccessToken } from "../../src/utils/helpers";

const MONGO_TEST_URI =
  "mongodb://root:password@localhost:27017/testdb?authSource=admin";

beforeAll(async () => {
  connectToMongoDB(MONGO_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectFromMongoDB();
});

describe("Categories API", () => {
  beforeEach(async () => {
    await Category.deleteMany();
    await User.deleteMany();
  });

  describe("GET /api/categories", () => {
    it("should fetch all categories without pagination", async () => {
      await Category.insertMany([
        {
          name: "Electronics",
          description: "Gadgets and devices",
          status: "ENABLED",
        },
        {
          name: "Clothing",
          description: "Apparel and accessories",
          status: "ENABLED",
        },
      ]);

      const res = await request(app).get("/api/categories");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successful");
      expect(res.body.data).toHaveLength(2);
    });

    it("should fetch paginated categories", async () => {
      await Category.insertMany([
        { name: "Category 1", description: "Description 1", status: "ENABLED" },
        { name: "Category 2", description: "Description 2", status: "ENABLED" },
        { name: "Category 3", description: "Description 3", status: "ENABLED" },
      ]);

      const res = await request(app).get("/api/categories?page=1&limit=2");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successful");
      expect(res.body.data).toHaveLength(2);
      expect(res.body.totalPages).toBe(2);
      expect(res.body.currentPage).toBe(1);
      expect(res.body.totalItems).toBe(3);
    });

    it("should fetch categories with status filter", async () => {
      await Category.insertMany([
        {
          name: "Enabled Category",
          description: "Description 1",
          status: "ENABLED",
        },
        {
          name: "Disabled Category",
          description: "Description 2",
          status: "DISABLED",
        },
      ]);

      const res = await request(app).get("/api/categories?status=DISABLED");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successful");
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe("Disabled Category");
    });
  });

  describe("GET /api/categories/:id", () => {
    it("should fetch a category by ID", async () => {
      const category = await Category.create({
        name: "Electronics",
        description: "Gadgets and devices",
        status: "ENABLED",
      });
      const categoryId = (category._id as ObjectId).toString();

      const res = await request(app).get(`/api/categories/${categoryId}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successful");
      expect(res.body.data.name).toBe("Electronics");
    });

    it("should return 404 if category is not found", async () => {
      const res = await request(app).get(
        `/api/categories/64b0c28f123456789abcdef0`
      );

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Category not found");
    });
  });

  describe("POST /api/categories", () => {
    it("should allow an admin to create a category", async () => {
      const adminUser = await User.create({
        email: "admin@admin.com",
        password: "password",
        role: "ADMIN",
      });
      const adminToken = generateAccessToken(adminUser);

      const payload = {
        name: "New Category",
        description: "A new test category",
        status: "ENABLED",
      };

      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Successful");
      expect(res.body.data.name).toBe("New Category");
    });

    it("should return 403 for non-admin users", async () => {
      const normalUser = await User.create({
        email: "test@test.com",
        password: "password",
        role: "USER",
      });
      const userToken = generateAccessToken(normalUser);

      const payload = {
        name: "Unauthorized Category",
        description: "Should not be allowed",
        status: "ENABLED",
      };

      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${userToken}`)
        .send(payload);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied. Insufficient permissions.");
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("should allow an admin to update an existing category", async () => {
      const adminUser = await User.create({
        email: "admin@admin.com",
        password: "password",
        role: "ADMIN",
      });
      const adminToken = generateAccessToken(adminUser);

      const category = await Category.create({
        name: "Old Category",
        description: "Old description",
        status: "DISABLED",
      });
      const categoryId = (category._id as ObjectId).toString();
      const payload = {
        name: "Updated Category",
        description: "Updated description",
        status: "ENABLED",
      };

      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successful");
      expect(res.body.data.name).toBe("Updated Category");
    });

    it("should return 403 for non-admin users", async () => {
      const normalUser = await User.create({
        email: "test@test.com",
        password: "password",
        role: "USER",
      });
      const adminToken = generateAccessToken(normalUser);

      const category = await Category.create({
        name: "Old Category",
        description: "Old description",
        status: "DISABLED",
      });
      const categoryId = (category._id as ObjectId).toString();
      const payload = {
        name: "Updated Category",
        description: "Updated description",
        status: "ENABLED",
      };

      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied. Insufficient permissions.");
    });

    it("should return 404 if category to update is not found", async () => {
      const adminUser = await User.create({
        email: "admin@admin.com",
        password: "password",
        role: "ADMIN",
      });
      const adminToken = generateAccessToken(adminUser);

      const payload = {
        name: "Nonexistent Category",
        description: "No description",
        status: "ENABLED",
      };

      const res = await request(app)
        .put(`/api/categories/64b0c28f123456789abcdef0`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Category not found");
    });
  });
});
