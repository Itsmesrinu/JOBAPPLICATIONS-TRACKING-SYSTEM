import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 1000, //1sec //15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

// Specific limiter for auth routes
export const authLimiter = rateLimit({
    windowMs: 1000,//60 * 60 * 1000, // 1 hour
    max: 10, // 5 attempts per hour
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
}); 