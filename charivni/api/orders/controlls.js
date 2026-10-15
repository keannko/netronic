
import { createOrderService, getAllOrdersService } from './services.js';


export const getAllOrdersController = async (req, res) => {
  try {
   const data = await getAllOrdersService()
    res.json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const createOrderController = async (req, res) => {
  try {
    
    const data = req.body
    const {refreshToken} = req.cookies

   const result= await createOrderService(data)

    res.json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// export const createNewUserController = async (req, res) => {
//   try {
//     req.body.password = await hashPassword(req.body.email);
//     const data = await createNewUserService(req.body)
//     res.cookie('refreshToken', data[0].refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true})
//     res.json(data);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

// export const loginUserController = async (req, res) => {
//   try {
//     const data = await loginUserService(req.body)
//     res.cookie('refreshToken', data.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true})
//     return res.json(data)
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

// export const logoutUserController = async (req, res) => {
//   try {
//    const {refreshToken} = req.cookies
//    const token = await logoutUserService(refreshToken)
//    res.clearCookie('refreshToken')
//    return res.json(token)
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

// export const refreshController = async (req, res) => {
//   try {
//    const {refreshToken} = req.cookies
//    const data = await refreshService(refreshToken)
//     res.cookie('refreshToken', data.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true})
//     res.json(data);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };



// export const getUserController = async (req, res) => {
//   try {
//    const data = await getUserService(req.params.id)
//     res.json(data);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

// export const getUserByTokenController = async (req, res) => {
//   try {
//    const data = req.cookies.refreshToken
//       const resp = await getUserByTokenService(data)
//     res.json(resp);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };
