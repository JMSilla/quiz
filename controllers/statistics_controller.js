var models = require('../models/models.js');

exports.index = function(req, res) {
  var totalQuestions = 0;
  var totalComments = 0;
  var questionsWithComments = 0;

  models.Quiz.count().then(function(number) {
    totalQuestions = number;

    models.Comment.count(
      {
        where: {
          publicado: true
        }
      }
    ).then(function(number) {
      totalComments = number;

      models.Quiz.findAll(
        {
          include: [
            {
              model: models.Comment,
              required: true,
              where: {
                publicado: true
              }
            }
          ]
        }
      ).then(function(quizes) {
        questionsWithComments = quizes.length;

        res.render('statistics/index',
        {
          statistics: {
            totalQuestions: totalQuestions,
            totalComments: totalComments,
            averageCommentsPerQuestion: (totalComments / totalQuestions).toFixed(2),
            questionsWithoutComments: totalQuestions - questionsWithComments,
            questionsWithComments: questionsWithComments,
          },
          errors: []
        });
      });
    });
  });
};
