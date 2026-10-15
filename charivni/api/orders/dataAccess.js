import { pool } from "../database.js";
import iconv from "iconv-lite";
import bcrypt from "bcryptjs";

export const getAllOrdersDataAccess = async (refreshToken) => {
  const promisePool = pool.promise();
  try {
    const query = `select * from orders`;
    const [queryResult] = await promisePool.query(query);
    return queryResult;
  } catch (error) {
    console.error(error);
  }
};

export const createOrderDataAccess = async (data) => {
  const promisePool = pool.promise();

  try {
    const queryProduct = `select quantity from products where id=${data.productId}`;
    const resultProduct = await promisePool.query(queryProduct);
    const resultQuantity = resultProduct[0][0].quantity
    const newQuantity = resultQuantity - 1



    const queryUpdateProduct = `UPDATE products SET quantity=${newQuantity} WHERE id=${data.productId}`;
    await promisePool.query(queryUpdateProduct);
 

    

    const utf8ProductId = iconv.encode(data.productId, "utf8");
    const utf8Name = iconv.encode(data.name, "utf8");
    const utf8Phone = iconv.encode(data.phone, "utf8");
    const utf8Town = iconv.encode(data.town, "utf8");
    const utf8NovaPost = iconv.encode(data.novapost, "utf8");
    const utf8Comment = iconv.encode(data.comment, "utf8");
    const query = `INSERT INTO orders (productId, customerName, customerPhone, town, postInfo, comment) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      utf8ProductId,
      utf8Name,
      utf8Phone,
      utf8Town,
      utf8NovaPost,
      utf8Comment,
    ];

    const results = await promisePool.query(query, values);
    return results;
  } catch (error) {
    console.error(error);
  }
};

// export const createNewUserDataAccess = async (userData) => {
//   const promisePool = pool.promise();
//   try {
//     const utf8Name = iconv.encode(userData.name, "utf8");
//     const utf8Phone = iconv.encode(userData.phone, "utf8");
//     const utf8Email = iconv.encode(userData.email, "utf8");
//     const utf8Region = iconv.encode(userData.region, "utf8");
//     const utf8VolunteerType = iconv.encode(userData.volunteerType, "utf8");
//     const utf8Town = iconv.encode(userData.town, "utf8");
//     const utf8Password = iconv.encode(userData.password, "utf8");

//     const queryUser = `SELECT userID FROM users WHERE email = ?`;
//     const valuesUser = [utf8Email];

//     const [existingUser] = await promisePool.query(queryUser, valuesUser);

//     if (existingUser.length > 0) {
//       return "duplicate";
//     } else {
//       const query = `INSERT INTO users (name, phone, email, region, volunteerType, town, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
//       const values = [
//         utf8Name,
//         utf8Phone,
//         utf8Email,
//         utf8Region,
//         utf8VolunteerType,
//         utf8Town,
//         utf8Password,
//         "user",
//       ];

//       const results = await promisePool.query(query, values);
//       const tokens = await tokenService(userData.name, userData.email);
//       results.unshift(tokens);
//       return results;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// export const loginUserDataAccess = async (userData) => {
//   const promisePool = pool.promise();
//   const utf8Email = iconv.encode(userData.email, "utf8");

//   const queryGetPassword = `SELECT password, name, email FROM users WHERE email = ?`;
//   const valuesGetPassword = [utf8Email];

//   const [existingPassword] = await promisePool.query(
//     queryGetPassword,
//     valuesGetPassword
//   );

//   if (existingPassword.length === 0) {
//     return { message: "email not found in DB" };
//   } else {
//     try {
//       const result = await new Promise((resolve, reject) => {
//         bcrypt.compare(
//           userData.password,
//           existingPassword[0].password,
//           (err, res) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(res);
//             }
//           }
//         );
//       });

//       if (result) {
//         const tokens = await tokenService(
//           existingPassword[0].name,
//           existingPassword[0].email
//         );
//         return tokens;
//       } else {
//         return { message: "incorrect password" };
//       }
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   }
// };

// export const logoutUserDataAccess = async (refreshToken) => {
//   const promisePool = pool.promise();

//   try {
//     const queryDeleteToken = `DELETE FROM tokens WHERE refreshToken= ?`;
//     const valuesDeleteToken = [refreshToken];

//     const [deleteToken] = await promisePool.query(
//       queryDeleteToken,
//       valuesDeleteToken
//     );
//     return deleteToken;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const refreshDataAccess = async (refreshToken) => {
//   const promisePool = pool.promise();

//   try {
//     const query = `select refreshToken from tokens where refreshToken= ?`;
//     const values = [refreshToken];
//     const [queryResult] = await promisePool.query(query, values);
//     return queryResult;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const refreshDataAccess2 = async (refreshToken) => {
//   const promisePool = pool.promise();

//   try {
//     const query = `select users.email, users.name from tokens
//     left join users
//     on tokens.user = users.userID
//     where tokens.refreshToken=?`;
//     const values = [refreshToken];
//     const [queryResult] = await promisePool.query(query, values);
//     const tokens = await tokenService(
//       queryResult[0].name,
//       queryResult[0].email
//     );
//     return tokens;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getAllUsersDataAccess = async () => {
//   const promisePool = pool.promise();

//   try {
//     const query = `select * from users`;
//     const [queryResult] = await promisePool.query(query);

//     return queryResult;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getUserDataAccess = async (id) => {
//   const promisePool = pool.promise();
//   try {
//     const query = `select * from users where userID=${id}`;
//     const [queryResult] = await promisePool.query(query);
//     return queryResult;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getUserByTokenDataAccess = async (token) => {
//   const promisePool = pool.promise();
//   try {
//     const query = `select userID, role from tokens
//     left join users
//     on tokens.user = users.userID
//     where refreshToken= ?`;
//     const value = [token]
//     const [queryResult] = await promisePool.query(query,value);
//     return queryResult;
//   } catch (error) {
//     console.error(error);
//   }
// };
