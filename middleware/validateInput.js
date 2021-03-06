/**
 * @fileoverview validateInput is a middleware that validates the email and password fields in the request object.
 * @exports validateInput
 */
export default (req, res, next) => {
  /**
   * @description Destructures and extracts email and password from Request object
   */
  const { email, password, username, worker, image } = req.body;

  /**
   * @description Tests for data input
   */
  if (!email || !password || worker === null || !username || !image) {
    res.status(401).json({ message: 'Invalid Sign Up Inputs' });
  }

  /**
   * @description Tests for data validity
   */
  else if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(401).json({ message: 'Invalid Sign Up Inputs' });
  }

  else {
    next();
  }
};