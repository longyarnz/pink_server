/**
 * @fileoverview tokenParser is a middleware that extracts token bearer from the headers of a request. 
 * The token is parsed and piped to the next callback.
 * @exports tokenParser
 */
import JWT from 'jsonwebtoken';
import { SERVER_KEY } from '../api/auth';
import { checkIfUserExists } from '../service/userService';

export default (req, res, next) => {
  const token = req.headers['authorization'];
  JWT.verify(token, SERVER_KEY, async (err, decoded) => {
    if (err) {
      res.status(400).json({message: 'Invalid User'});
    }
    else {
      const userExists = await checkIfUserExists({ _id: decoded.id });
      if(userExists){
        req.userId = decoded.id;
        next();
      }
      else{
        res.status(400).json({message: 'Invalid User'});
      }
    }
  });
};