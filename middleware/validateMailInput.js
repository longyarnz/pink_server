/**
 * @fileoverview validateInput is a middleware that validates the email and password fields in the request object.
 * @exports validateMailInput
 */
export default (req, res, next) => {
  /**
   * @description Destructures and extracts email and password from Request object
   */
  const { name, email, text } = req.body;

  console.log(req.body);

  /**
   * @description Tests for data input
   */
  if (!email || !name || !text) {
    res.status(401).json({ text: 'Invalid Inputs' });
  }

  /**
   * @description Tests for data validity
   */
  else if (typeof email !== 'string' || typeof name !== 'string' || typeof text !== 'string') {
    res.status(401).json({ message: 'Invalid Inputs' });
  }

  else {
    next();
  }
};