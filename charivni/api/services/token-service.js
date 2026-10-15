import jwt from 'jsonwebtoken';
import iconv from "iconv-lite";
import { pool } from '../database.js';

export const tokenService = async (name, email) => {
    const data = {name, email}
    const accessToken = jwt.sign(data, process.env.JWT_ACCESS_SECRET, {expiresIn:'5h'})
    const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
    const utf8Email = iconv.encode(email, "utf8");
    const promisePool = pool.promise();


    const queryUser = `SELECT tokens.refreshToken, users.userID FROM users
                        LEFT JOIN tokens
                        ON users.userID = tokens.user
                        WHERE users.email= ?`;
    const valuesUser = [utf8Email];
    const [existingUser] = await promisePool.query(queryUser, valuesUser);

    if(existingUser[0].refreshToken){
        const queryUpdateRefreshToken = `UPDATE tokens SET refreshToken= ? where user= ?`;
        const values = [
            refreshToken,
            existingUser[0].userID,
          ];
          const results = await promisePool.query(queryUpdateRefreshToken, values);
    }else{
        const queryCreateRefreshToken = `INSERT INTO tokens (user, refreshToken) VALUES (?,?)`;
        const values = [
            existingUser[0].userID,
            refreshToken
          ];
          const results = await promisePool.query(queryCreateRefreshToken, values);
    }
    
    return {
        accessToken,
        refreshToken
    }
    
}

export const validateAccessToken = (token) => {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  
export const validateRefreshToken = (token) => {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }