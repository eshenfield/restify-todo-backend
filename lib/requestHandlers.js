'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllTodos = getAllTodos;
exports.getTodo = getTodo;
exports.newTodo = newTodo;
exports.deleteAllTodos = deleteAllTodos;

var _restify = require('restify');

var restify = _interopRequireWildcard(_restify);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mongoUrl = 'mongodb://localhost:27017/todo-backend';
var hostName = 'http://localhost:8080';

function getAllTodos(req, res, next) {
  _mongodb2.default.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to mongoDb server: ' + err);
      return next(new restify.InternalServerError('uh oh! Something went wrong'));
    } else {
      var collection = db.collection('todos');

      collection.find({}).toArray(function (err, result) {
        if (err) {
          console.log('Something went wrong reading from the db');
          return next(new restify.InternalServerError('uh oh! Something went wrong'));
        } else {
          res.send(result);
          db.close();
          return next();
        }
      });
    }
  });
};

function getTodo(req, res, next) {
  var id = req.params.todoId;
  _mongodb2.default.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to mongoDb server: ' + err);
      return next(new restify.InternalServerError('uh oh! Something went wrong'));
    } else {
      var collection = db.collection('todos');
      collection.find().toArray(function (err, todos) {
        if (err) {
          return next(new restify.InternalServerError('uh oh! Something went wrong'));
        } else {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = todos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var todo = _step.value;

              if (todo._id = id) {
                res.send(todo);
                db.close();
                return next();
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      });
    }
  });
}

function newTodo(req, res, next) {
  // Connect to database
  _mongodb2.default.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to mongoDb server: ' + err);
      return next(new restify.InternalServerError('uh oh! Something went wrong'));
    } else {
      (function () {
        var collection = db.collection('todos');
        // Find the count of documents to generate the docId
        collection.count({}, function (err, result) {
          var count = result + 1;
          var todo = {
            _id: count,
            completed: false,
            title: req.body.title,
            url: hostName + '/' + count
          };
          // Insert the todo into the database
          collection.insert(todo, function (err, result) {
            if (err) {
              console.log('Something went wrong inserting in the db');
              return next(new restify.InternalServerError('uh oh! Something went wrong'));
            } else {
              // Send the new todo as the result
              res.send(todo);
              db.close();
              return next();
            }
          });
        });;;;
      })();
    }
  });
};

function deleteAllTodos(req, res, next) {
  _mongodb2.default.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to mongoDb server: ' + err);
      return next(new restify.InternalServerError('uh oh! Something went wrong'));
    } else {
      var collection = db.collection('todos');

      collection.remove({}, function (err, result) {
        if (err) {
          console.log('Something went wrong deleting in the db');
          return next(new restify.InternalServerError('uh oh! Something went wrong'));
        } else {
          // Send an empty array as the result
          res.send('[]');
          db.close();
          return next();
        }
      });
    }
  });
};