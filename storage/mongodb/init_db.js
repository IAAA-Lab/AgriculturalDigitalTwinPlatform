console.log("=> Creating a user and a database...");

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
db.createCollection("Users");
// Insert user in Users collection
db.Users.insertOne({
  email: process.env.MONGO_FIRST_USER_NAME,
  password: process.env.MONGO_FIRST_USER_PASSWORD,
  role: process.env.MONGO_FIRST_USER_ROLE,
});
