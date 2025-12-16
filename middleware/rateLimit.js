// Simple in-memory rate limiter (per IP, per endpoint)
const rateLimitMap = new Map();

function rateLimit({ windowMs = 60000, max = 5 } = {}) {
  return (req, res, next) => {
    const ip = req.ip;
    const endpoint = req.path;
    const key = `${ip}|${endpoint}`;
    const now = Date.now();
    if (!rateLimitMap.has(key)) rateLimitMap.set(key, []);
    // Remove timestamps outside window
    let timestamps = rateLimitMap.get(key).filter(ts => now - ts < windowMs);
    if (timestamps.length >= max) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }
    timestamps.push(now);
    rateLimitMap.set(key, timestamps);
    next();
  };
}

module.exports = rateLimit;

