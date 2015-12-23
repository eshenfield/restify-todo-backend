'use strict';

var _restify = require('restify');

var restify = _interopRequireWildcard(_restify);

var _requestHandlers = require('./requestHandlers');

var requestHandlers = _interopRequireWildcard(_requestHandlers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PORT = 8080;

var server = restify.createServer({
  name: 'todo-backend',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

server.get('/', requestHandlers.getAllTodos);

server.get('/:todoId', requestHandlers.getTodo);

server.post('/', requestHandlers.newTodo);

server.del('/', requestHandlers.deleteAllTodos);

server.listen(PORT, function () {
  console.log(server.name + ' listening at ' + PORT);
});