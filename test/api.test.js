const { assert, expect } = require("chai");
const request = require("supertest");

const app = require("../server.js");

const { queryPromise } = require("../src/db/connections");

// username test is reserved for testing

describe("API backend", () => {
  before(() => {
    queryPromise("DELETE FROM users WHERE username='test'", null);
  });
  after(() => {
    queryPromise("DELETE FROM users WHERE username='test'", null);
  });
  describe("Route protection", () => {
    describe("Private Routes", () => {
      it("GET /api/users", () => {
        return request(app).get("/api/users").expect(401);
      });
      it("GET /api/calories", () => {
        return request(app).get("/api/calories").expect(401);
      });

      it("GET /api/data", () => {
        return request(app).get("/api/data").expect(401);
      });
      it("GET /api/goals", () => {
        return request(app).get("/api/goals").expect(401);
      });
      it("GET /api/weight", () => {
        return request(app).get("/api/weight").expect(401);
      });
      it("GET /api/tdee/:date", () => {
        return request(app).get("/api/tdee/test").expect(401);
      });
      it("POST /api/calories", () => {
        return request(app).post("/api/calories").expect(401);
      });
      it("POST /api/goals", () => {
        return request(app).post("/api/goals").expect(401);
      });
      it("POST /api/weight", () => {
        return request(app).post("/api/weight").expect(401);
      });
      it("DELETE /api/data/:date", () => {
        return request(app).delete("/api/data/test").expect(401);
      });
    });
    describe("Public Routes", () => {
      it("POST /api/users", () => {
        return request(app)
          .post("/api/users")
          .expect((res) => {
            expect(res.statusCode).to.not.equal(401);
          });
      });
      it("POST /api/login", () => {
        return request(app)
          .post("/api/login")
          .expect((res) => {
            expect(res.statusCode).to.not.equal(401);
          });
      });
    });
  });
  describe("Routes", () => {
    // JWT token
    let token;
    describe("User login and register", () => {
      it("POST /api/users - register user", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "test",
            password: "password",
            start_date: "2021-10-1",
            start_weight: 200,
          })
          .expect((res) => {
            expect(res.body).to.have.keys("token");
            if (res.body.token) {
              token = res.body.token;
            }
          });
      });
      it("GET /api/users - get user", () => {
        return request(app)
          .get("/api/users")
          .set({ "x-auth-token": token })
          .expect(200);
      });
      it("POST /api/users - register already existing username", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "test",
            password: "password",
            start_date: "2021-10-1",
            start_weight: 200,
          })
          .expect(400);
      });
      it("POST /api/users - register user short password", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "test",
            password: "pas",
            start_date: "2021-10-1",
            start_weight: 200,
          })
          .expect(400);
      });
      it("POST /api/login - login wrong password unsuccessful", () => {
        return request(app)
          .post("/api/login")
          .send({
            username: "test",
            password: "pas",
          })
          .expect(400);
      });
      it("POST /api/login - login successful", () => {
        return request(app)
          .post("/api/login")
          .send({
            username: "test",
            password: "password",
          })
          .expect(200);
      });
    });
    describe("/api/data", () => {
      let firstDayData;
      let firstDay;
      it("GET /api/data - get all data", () => {
        return request(app)
          .get("/api/data")
          .set({ "x-auth-token": token })
          .expect((res) => {
            expect(res.body[0]).to.be.ok;
            if (res.body[0]) {
              firstDayData = res.body[0];
              firstDay = firstDayData.date.split(" ")[0];
            }
          })
          .expect(200);
      });
      it("GET /api/data/:date - deleting user has only 1 entry errors", () => {
        return request(app)
          .delete(`/api/data/${firstDay}`)
          .set({ "x-auth-token": token })
          .expect((res) => {
            expect(res.body.errors).to.be.ok;
          })
          .expect(400);
      });
    });
  });
});
