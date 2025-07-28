# LOLZA-Core

## Folder/File Structure:
– config: Only configuration (e.g. DB connection).
– graphql: Contains the API layer (type definitions and resolvers).
– middleware: Holds Express middleware (like authentication).
– repositories: Abstracts direct database calls (persistence logic).
– services: Implements business logic and uses repositories; In the future, if you add caching, validation, or complex transformations, you do it here.
– utils: Contains utilities (e.g. logging).
– index.ts: Bootstraps the server.