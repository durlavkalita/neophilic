import request from "supertest";
import app from "../../src/app";
import { describe, expect, it } from "@jest/globals";
// import { Category } from "../../src/modules/categories/categories.model";

// jest.mock("../../config/logger.config", () => ({
//   error: jest.fn(),
//   info: jest.fn(),
// }));

// jest.mock("../../src/categories/categories.model", () => ({
//   Category: {
//     find: jest.fn(),
//     findById: jest.fn(),
//     save: jest.fn(),
//     findByIdAndUpdate: jest.fn(),
//     countDocuments: jest.fn(),
//   },
// }));

// const MockCategory = Category as jest.Mocked<typeof Category>;

describe("Home API", () => {
  describe("GET /", () => {
    it("Should fetch homepage", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });
  });
  // describe("GET /categories", () => {
  // it("should fetch all categories without pagination", async () => {
  //   const mockCategories = [{ name: "Category1" }, { name: "Category2" }];
  //   MockCategory.find.mockResolvedValue(mockCategories);

  //   const res = await request(app).get("/api/categories");
  //   expect(res.status).toBe(200);
  //   expect(res.body.message).toBe("Successful");
  //   expect(res.body.data).toEqual(mockCategories);
  // });

  // it('should fetch paginated categories', async () => {
  //   const mockCategories = [{ name: 'Category1' }, { name: 'Category2' }];
  //   Category.find.mockResolvedValue(mockCategories);
  //   Category.countDocuments.mockResolvedValue(50);

  //   const res = await request(app)
  //     .get('/api/categories')
  //     .query({ page: 1, limit: 10 });
  //   expect(res.status).toBe(200);
  //   expect(res.body.message).toBe('Successful');
  //   expect(res.body.data).toEqual(mockCategories);
  //   expect(res.body.totalPages).toBe(5);
  //   expect(res.body.currentPage).toBe(1);
  //   expect(res.body.totalItems).toBe(50);
  // });

  // it('should return 500 on database error', async () => {
  //   Category.find.mockRejectedValue(new Error('Database error'));

  //   const res = await request(app).get('/api/categories');
  //   expect(res.status).toBe(500);
  //   expect(res.body.message).toBe('Unsuccessful');
  //   expect(res.body.error).toBe('Database error');
  // });
  // });

  // describe('GET /categories/:id', () => {
  //   it('should fetch a category by ID', async () => {
  //     const mockCategory = { name: 'Category1' };
  //     Category.findById.mockResolvedValue(mockCategory);

  //     const res = await request(app).get('/api/categories/1');
  //     expect(res.status).toBe(200);
  //     expect(res.body.message).toBe('Successful');
  //     expect(res.body.data).toEqual(mockCategory);
  //   });

  //   it('should return 404 if category is not found', async () => {
  //     Category.findById.mockResolvedValue(null);

  //     const res = await request(app).get('/api/categories/1');
  //     expect(res.status).toBe(404);
  //     expect(res.body.message).toBe('Category not found');
  //   });

  //   it('should return 500 on database error', async () => {
  //     Category.findById.mockRejectedValue(new Error('Database error'));

  //     const res = await request(app).get('/api/categories/1');
  //     expect(res.status).toBe(500);
  //     expect(res.body.message).toBe('Unsuccessful');
  //     expect(res.body.error).toBe('Database error');
  //   });
  // });

  // describe('POST /categories', () => {
  //   it('should create a new category', async () => {
  //     const mockCategory = { name: 'New Category', description: 'Test Desc' };
  //     Category.save.mockResolvedValue(mockCategory);

  //     const res = await request(app).post('/api/categories').send(mockCategory);
  //     expect(res.status).toBe(201);
  //     expect(res.body.message).toBe('Successful');
  //     expect(res.body.data).toEqual(mockCategory);
  //   });

  //   it('should return 500 on database error', async () => {
  //     Category.save.mockRejectedValue(new Error('Database error'));

  //     const res = await request(app)
  //       .post('/api/categories')
  //       .send({ name: 'New Category', description: 'Test Desc' });
  //     expect(res.status).toBe(500);
  //     expect(res.body.message).toBe('Unsuccessful');
  //     expect(res.body.error).toBe('Database error');
  //   });
  // });

  // describe('PUT /categories/:id', () => {
  //   it('should update a category by ID', async () => {
  //     const mockCategory = { name: 'Updated Category', description: 'Updated Desc' };
  //     Category.findByIdAndUpdate.mockResolvedValue(mockCategory);

  //     const res = await request(app)
  //       .put('/api/categories/1')
  //       .send({ name: 'Updated Category' });
  //     expect(res.status).toBe(200);
  //     expect(res.body.message).toBe('Successful');
  //     expect(res.body.data).toEqual(mockCategory);
  //   });

  //   it('should return 404 if category is not found', async () => {
  //     Category.findByIdAndUpdate.mockResolvedValue(null);

  //     const res = await request(app)
  //       .put('/api/categories/1')
  //       .send({ name: 'Updated Category' });
  //     expect(res.status).toBe(404);
  //     expect(res.body.message).toBe('Category not found');
  //   });

  //   it('should return 500 on database error', async () => {
  //     Category.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

  //     const res = await request(app)
  //       .put('/api/categories/1')
  //       .send({ name: 'Updated Category' });
  //     expect(res.status).toBe(500);
  //     expect(res.body.message).toBe('Unsuccessful');
  //     expect(res.body.error).toBe('Database error');
  //   });
  // });
});
