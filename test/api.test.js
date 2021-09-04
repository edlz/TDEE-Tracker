// const chai = require("chai");
// const should = chai.should();
// const request = require("supertest");
// const app = require("../server.js");

// describe("GET /", function () {
//   it("/api/users private route", function () {
//     return request(app).get("/api/users").expect(401);
//   });
// });

// describe("POST /", function () {
//   it("/api/users testing register user", function () {
//     return request(app)
//       .post("/api/users")
//       .send({
//         username: "test",
//         password: "password",
//         start_date: "2021-10-1",
//         start_weight: 200,
//       })
//       .expect((res) => {
//         if (res.body.errors) {
//           return;
//         }
//         .should.exist(res.body.token);
//       });
//     // or 400 if name taken
//   });
// });
