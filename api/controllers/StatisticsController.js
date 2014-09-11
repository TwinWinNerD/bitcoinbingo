module.exports = {

  index: function (req, res) {
    StatisticsService.getStatistics().then(function (result) {
      res.json(result);
    });
  }
};