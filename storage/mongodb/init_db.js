console.log("=> Creating a user and a database...");

common = db.getSiblingDB("common");
common.createCollection("Users");
common.Users.createIndex({ email: 1 }, { unique: true });
// Insert user in Users collection
common.Users.insertOne({
  email: process.env.MONGO_FIRST_USER_NAME,
  password: process.env.MONGO_FIRST_USER_PASSWORD,
  role: process.env.MONGO_FIRST_USER_ROLE,
});
