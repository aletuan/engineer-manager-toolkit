import app from './app';
import { config } from './shared/config';
import { createApolloServer } from './graphql/server';


// Start server
app.listen(config.port, () => {
  console.log(`🚀 REST API Server ready at http://localhost:${config.port}`);
  console.log(`📚 API Documentation available at http://localhost:${config.port}/api-docs`);
});

// Start GraphQL server
const graphqlPort = 3002;
createApolloServer().then((graphqlApp) => {
  graphqlApp.listen(graphqlPort, () => {
    console.log(`🚀 GraphQL Server ready at http://localhost:${graphqlPort}/graphql`);
  });
}); 