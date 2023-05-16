const { ApolloServer } = require('apollo-server');
const { mongoose } = require('mongoose');

const { MONGO_CONNECTION_URL } = require('./keys.js');
const typeDefs = require('./graphql/typedefs.js');
const resolvers = require('./graphql/resolvers');

const PORT = 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: function(param){ return { req: param.req } }
})

mongoose.connect(MONGO_CONNECTION_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('Database Connected!!!');
    server.listen(PORT)
      .then((res) => console.log(`server started at port: ${res.url}`))
      .catch((err) => console.log('server error: ' + err));
  })
  .catch((err) => {
    console.log('mongo error: ' + err);
  })
