import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error("Password hashing failed:", error);
    throw error;
  }
};

// const savedHashedPassword = '...';

// bcrypt.compare(password, savedHashedPassword, (err, result) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   if (result) {
//     console.log('Password is correct');
//   } else {
//     console.log('Password is incorrect');
//   }
// });
