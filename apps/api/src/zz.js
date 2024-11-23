const bcrypt = require("bcryptjs");

async function createHashedPassword(password) {
  const saltRounds = 10; // Number of salt rounds (default is 10)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

(async () => {
  const password = "notgonnatell";
  const hashedPassword = await createHashedPassword(password);
  console.log(hashedPassword);
})();
