import * as restify from 'restify'
import MongoClient from 'mongodb'
const mongoUrl = 'mongodb://localhost:27017/todo-backend'
const hostName = 'http://localhost:8080'

export function getAllTodos(req, res, next) {
  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) { 
      console.log(`Unable to connect to mongoDb server: ${err}`)
      return next(new restify.InternalServerError('uh oh! Something went wrong'));
    } else {
      let collection = db.collection('todos');
      
      collection.find({}).toArray(function(err, result) {
        if (err) {
          console.log('Something went wrong reading from the db');
          return next(new restify.InternalServerError('uh oh! Something went wrong'));
        } else {
          res.send(result);
          db.close()
          return next()
        }
      });
    }
  });
};

export function getTodo(req, res, next) {
  const id = req.params.todoId
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
      console.log(`Unable to connect to mongoDb server: ${err}`)
      return next(new restify.InternalServerError('uh oh! Something went wrong'));
    } else {
      let collection = db.collection('todos')
      collection.find().toArray(function(err, todos) {
        if (err) {
          return next(new restify.InternalServerError('uh oh! Something went wrong'));
        } else {
          for (var todo of todos) {
            if(todo._id === id){
              res.send(todo);
              db.close();
              return next();
            }
          }
          db.close();
          // TODO: Fix this?
          return new restify.BadRequestError('That todo doesn\'t seem to exist!')
        }
      });
    }
  })
}

export function newTodo(req, res, next) {
  // Connect to database
  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) { 
      console.log(`Unable to connect to mongoDb server: ${err}`)
      return next(new restify.InternalServerError('uh oh! Something went wrong'));
    } else {
      let collection = db.collection('todos');
      // Find the count of documents to generate the docId
      collection.count({}, function(err, result) {
        let count = result + 1;
        const todo = {
          _id: count,
          completed: false,
          title: req.body.title,
          url: `${hostName}/${count}`
        }
        // Insert the todo into the database
        collection.insert(todo, function(err, result) {
          if (err) {
            console.log('Something went wrong inserting in the db');
            return next(new restify.InternalServerError('uh oh! Something went wrong'));
          } else {
            // Send the new todo as the result
            res.send(todo);
            db.close()
            return next()
          }
        });
      });;;;
    }
  });
};

export function deleteAllTodos(req, res, next) {
  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) { 
      console.log(`Unable to connect to mongoDb server: ${err}`)
      return next(new restify.InternalServerError('uh oh! Something went wrong'));
    } else {
      let collection = db.collection('todos');
      
      collection.remove({}, function(err, result) {
        if (err) {
          console.log('Something went wrong deleting in the db');
          return next(new restify.InternalServerError('uh oh! Something went wrong'));
        } else {
          // Send an empty array as the result
          res.send('[]');
          db.close()
          return next()
        }
      });
    }
  });
};

