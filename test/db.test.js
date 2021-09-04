// DELETE FROM tdeedb WHERE username='test'
const { assert, expect } = require("chai");
const { pool, queryPromise } = require("../src/db/connections");

describe("MySQL DB", () => {
  it("connection established", (done) => {
    pool.getConnection((err, conn) => {
      if (err) {
        done(err);
        return;
      }
      assert.ok(conn);
      done();
    });
  });
  it("contains correct tables", (done) => {
    pool.query("show tables", function (error, results) {
      if (error) throw error;
      assert.equal(results.length, 3);
      expect(results).to.deep.include({ Tables_in_tdeedb: "data_entry" });
      expect(results).to.deep.include({ Tables_in_tdeedb: "goals" });
      expect(results).to.deep.include({ Tables_in_tdeedb: "users" });
      done();
    });
  });
  it("queryPromise function working", (done) => {
    queryPromise("show tables", null).then((res) => {
      assert.equal(res.length, 3);
      done();
    });
  });
});
