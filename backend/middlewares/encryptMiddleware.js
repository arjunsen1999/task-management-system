// middlewares/encryptMiddleware.js
import { decryptRequest, encryptResponse } from '../utils/crypto.js';

export const decryptMiddleware = (req, res, next) => {
  try {
    if (req.body?.ciphertext) {
      req.body = decryptRequest(req.body.ciphertext);
    }
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Invalid encrypted payload' });
  }
};

export const encryptMiddleware = (req, res, next) => {
  const originalJson = res.json;
  res.json = (data) => {
    const encrypted = encryptResponse(data);
    return originalJson.call(res, { ciphertext: encrypted });
  };
  next();
};
