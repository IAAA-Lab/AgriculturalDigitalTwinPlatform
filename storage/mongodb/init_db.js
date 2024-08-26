// console.log("=> Creating a user and a database...");

// // Wait for the MongoDB to be ready
// sleep(20000);

// var rootUser = process.env.MONGO_INITDB_ROOT_USERNAME;
// var rootPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
// db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
// db.auth(rootUser, rootPassword);
common = db.getSiblingDB("common");
common.createCollection("Users");
common.Users.createIndex({ email: 1 }, { unique: true });
// Insert user in Users collection
common.Users.insertOne({
  email: process.env.MONGO_FIRST_USER_NAME,
  password: process.env.MONGO_FIRST_USER_PASSWORD,
  role: process.env.MONGO_FIRST_USER_ROLE,
});
// // // Sleep for 10 seconds
// // sleep(10000);
// // // Init replicaset

// rs.initiate(
//   {
//     _id: "rs0",
//     members: [{ _id: 0, host: "mongo:27017" }],
//   },
//   { force: true }
// );
// rs.status();
