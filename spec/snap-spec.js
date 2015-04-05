(function() {
  describe('Simple snap', function() {
    return it('should inherit from SimpleModule', function() {
      var snap;
      snap = simple.snap();
      return expect(snap instanceof SimpleModule).toBe(true);
    });
  });

}).call(this);
