process.env.NODE_ENV = process.env.NODE_ENV || "test";
require("dotenv").load();

const keystone = require("keystone");
const chai = require("chai");

keystone.init({
	"name": "YourExactProjectName",
	"s3 config": {}, // leave this here or stuff will break (magic)
});

keystone.import("../models");

chai.should();
