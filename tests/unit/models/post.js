/*
  Post Unit Test
  for Keystone.JS built-in Post Model
 */
var keystone = require('keystone');
var chai = require('chai');
var dbURI = 'mongodb://localhost/<< YOUR DB >>' || process.env.MONGO_URL;
            // CHANGE THIS AS NEEDED

describe('Posts', function () {
	beforeEach(function (done) {
		if (keystone.mongoose.connection.db) return done();
		console.log('Connecting to ' + dbURI);
		keystone.mongoose.connect(dbURI, done);
	});

	it('should be a connection to Mongo', function (done) {
		keystone.mongoose.connection.db.should.be.a('Object');
		done();
	});

	it('should be a Mongoose Model', function (done) {
		Post = keystone.list('Post');

		Post.should.be.a('Object');
		Post.should.have.property('model').be.a('Function');
		Post.should.have.property('schema').be.a('Object');

		done();
	});
});
