import rateLimit from "express-rate-limit";


export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});


export const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Upload limit reached: You can only upload 10 images per minute.",
  },
});

