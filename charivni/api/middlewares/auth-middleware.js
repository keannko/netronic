import { validateAccessToken } from "../services/token-service.js";

export default function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
        return next('Problems with authorization1')
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
        return next('Problems with authorization2')
    }
    const userData = validateAccessToken(accessToken)

    if(!userData) {
        return next('Problems with authorization3')
    }
    req.user = userData
    next()
  } catch (e) {
    return next('Problems with authorization4')
  }
}
