const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type UserInputData {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Event {
    title: String!
    description: String!
    price: String!
    thumbnail: String!
    date: String!
    sport: String!
    user: User
  }

  type EventInputData {
    title: String!
    description: String!
    price: Float!
    thumbnail: String!
    date: String!
    sport: String!
  }

  type RootQuery {
    fetchUser(id: ID!): User!
  }
  type RootMutation {
    createUser(UserInput: UserInputData): User!
    createEvent(EventInput: EventInputData): Event!
  }
`)