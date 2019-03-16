/**
 * @fileoverview validateInput is a middleware that validates the amount and hookup fields in the request object.
 * @exports validateInput
 */
export default (req, res, next) => {
  /**
   * @description Destructures and extracts amount and hookup from Request object
   */
  const { amount, hookup, purpose } = req.body;

  /**
   * @description Tests for data input
   */
  if (!amount || !hookup || !purpose) {
    res.status(401).json({ message: 'Invalid Inputs' });
  }

  /**
   * @description Tests for data validity
   */
  else if (typeof amount !== 'number' || typeof hookup !== 'string' || typeof purpose !== 'string') {
    res.status(401).json({ message: 'Invalid Inputs' });
  }

  else {
    next();
  }
};