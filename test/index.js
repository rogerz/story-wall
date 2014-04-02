var expect = require('chai').expect,
    storyWall = require('..');

describe('story-wall', function() {
  it('should say hello', function(done) {
    expect(storyWall()).to.equal('Hello, world');
    done();
  });
});
