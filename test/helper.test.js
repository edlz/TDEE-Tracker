const { assert } = require("chai");

const { toMysqlFormat, toMysqlFormatDay } = require("../src/utils/utils");
Date.prototype.toMysqlFormat = toMysqlFormat;
Date.prototype.toMysqlFormatDay = toMysqlFormatDay;

describe("Functions", () => {
  const d = new Date(0);
  it("toMysqlFormat", () => {
    assert.equal(d.toMysqlFormat(), "1970-01-01 00:00:00");
  });
  it("toMysqlFormatDay", () => {
    assert.equal(d.toMysqlFormatDay(), "1970-01-01");
  });
});
