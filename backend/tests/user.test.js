const request = require("supertest");
const app = require("../app");
const db = require("../app/models");

// Connect to database before each test
beforeEach(async () => {
  await db.sequelize.sync();
});

// Disconnect from database after each test
afterEach(async () => {
  
});

/* TESTS */

// Signup new user
describe("POST /api/users/signup", () => {
  it("should signup a new user", async () => {
    const res = await request(app).post("/api/users/signup").send({
      username: "JestTestUser",
      email: "jesttestuser@gmail.com",
      password: "passwordjest",
      avatar: "default.png"
    });
    expect(res.body.username).toBe("JestTestUser");
  });
});

// User login test
describe("POST /api/users/login", () => {
  it("should log a user in", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "jesttestuser@gmail.com",
      password: "passwordjest"
    });
    expect(res.body.username).toBe("JestTestUser");
  });
});

// Reset user password test
describe("PUT /api/users/reset_password", () => {
  it("should change user's password", async () => {
    const res = await request(app).put("/api/users/reset_password").send({
      email: "jesttestuser@gmail.com",
      password: "passwordjest2",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Implc3R0ZXN0dXNlckBnbWFpbC5jb20iLCJpYXQiOjE2OTc0NjAyNTd9.Lznc-KmZhRCoArq5opweUxCJVz3o0EWNvXcrZeSPznQ"
    });
    expect(res.text).toBe("User password updated successfully");
  });
});

// Edit user profile test
describe("PUT /api/users/edit_profile", () => {
  it("should edit user's profile", async () => {
    const res = await request(app).put("/api/users/edit_profile").send({
      username: "JestTestUser",
      email: "jesttestuser2@gmail.com",
      password: "passwordjest2",
      avatar: "default.png",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Implc3R0ZXN0dXNlckBnbWFpbC5jb20iLCJpYXQiOjE2OTc0NjAyNTd9.Lznc-KmZhRCoArq5opweUxCJVz3o0EWNvXcrZeSPznQ"
    });
    expect(res.body.email).toBe("jesttestuser2@gmail.com");
  });
});

// Delete user profile
describe("DELETE /api/users/delete_profile", () => {
  it("should delete a user's profile", async () => {
    const res = await request(app).delete("/api/users/delete_profile").send({
      username: "JestTestUser",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Implc3R0ZXN0dXNlckBnbWFpbC5jb20iLCJpYXQiOjE2OTc0NjAyNTd9.Lznc-KmZhRCoArq5opweUxCJVz3o0EWNvXcrZeSPznQ"
    });
    expect(res.text).toBe("User successfully deleted.");
  });
});