import * as restify from 'restify'
import * as requestHandlers from './requestHandlers'

const PORT = 8080;

const server = restify.createServer({
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

server.listen(PORT, function() {
  console.log(`${server.name} listening at ${PORT}`)
});