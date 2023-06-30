import { verifyAccessToken } from '../utils/jwt.js'

export default async function auth(req, res, next) {
  /*This code block is used to check if the Authorization header is present in the request. 
  If the Authorization header is not found or is missing, 
  it means that the user is not authorized to access the requested resource.*/
  if (!req.headers.authorization) {
    return res.status(401).send({'error': 'Unauthorized'})
  }

  /*The code req.headers.authorization.split(' ') splits the Authorization header value 
  into an array of strings, using a space(' ') as the separator.
  It splits the header into two parts: the type or scheme identifier and the token itself.*/
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(401).send({ 'error': 'Unauthorized' })
  }

  await verifyAccessToken(token).then(user => {
    req.user = user // store the user in the `req` object. our next route now has access to the user via `req.user`
    /*In this code, next() is a function that is called to pass control to the next middleware
    function in the request-response cycle. It is typically used in Express.js middleware to move 
    the execution flow to the next middleware or route handler.*/
    next()
  }).catch(e => {
    return res.status(401).send({ 'error': e.message })
  })
}