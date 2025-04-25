import rateLimit from "express-rate-limit";
import { config } from "../lib/config";

const keyGenerator = (req: any, res: any) => {
  return req.user?.id ? `user-${req.user.id}` : `ip-${req.ip}`;
};

export const generalRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_GENERAL_WINDOW_MS,
  max: config.RATE_LIMIT_GENERAL_MAX,
  message: {
    status: 429,
    message: `Too many requests, please try again later.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const testRunRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_TEST_RUN_WINDOW_MS,
  max: config.RATE_LIMIT_TEST_RUN_MAX,
  keyGenerator,
  message: {
    status: 429,
    message: `Too many test runs, please try again later.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const submissionRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_SUBMISSION_WINDOW_MS,
  max: config.RATE_LIMIT_SUBMISSION_RUN_MAX,
  keyGenerator,
  message: {
    status: 429,
    message: `Too many submissions, please try again later.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
