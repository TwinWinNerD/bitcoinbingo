module.exports = function (whereStatement, includeStatement, eagerLoading) {

  if (whereStatement) {
    this.where = whereStatement;
  }

  if (eagerLoading === true) {
    this.include = includeStatement;
  }
};