db.createUser({
  user: "user",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "sebx",
    },
  ],
});

db = new Mongo().getDB("sebx");
db.createCollection("users", { capped: false });

const numUsers = 12;
db.users.insert(
  Array.from(Array(numUsers)).map((_, i) => ({
    username: "rebecka" + (i + 1),
    password: "$2b$10$4wX/IOzW2nQR3CxYTlp/eOPX2k64E9Wg1yJRCGrSp59dKp0qM7w6m",
  }))
);
