var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function (quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      }
      else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch (function (error) { next(error); });
};

exports.index = function(req, res) {
  var valorBusqueda = req.query.search || '';
  var busquedaLike = '%' + valorBusqueda.trim().replace(/\s+/g, '%') + '%';

  models.Quiz.findAll(
    {
      where: ['pregunta like ?', busquedaLike],
      order: 'pregunta ASC'
    }
  ).then(
    function(quizes) {
      res.render('quizes/index', {quizes: quizes, valorBusqueda: valorBusqueda, errors: []});
    }
  ).catch(function (error) { next(error); });
};

exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

exports.answer = function(req, res) {
  var resultado = 'Incorrecto';

  if (req.query.respuesta === req.quiz.respuesta)
    resultado = 'Correcto';

  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);

  quiz.validate().then(
      function(err) {
        if (err) {
          res.render('quizes/new', {quiz: quiz, errors: err.errors});
        }
        else {
          quiz.save({fields: ['pregunta', 'respuesta']}).then(function() {
            res.redirect('/quizes');
          });
        }
      }
  );
};

exports.edit = function(req, res) {
  res.render('quizes/edit', {quiz: req.quiz, errors: []});
};

exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz.validate().then(function(err) {
    if (err)
      res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
    else {
      req.quiz.save({fields: ['pregunta', 'respuesta']}).then(function() {
        res.redirect('/quizes');
      });
    }
  });
};
