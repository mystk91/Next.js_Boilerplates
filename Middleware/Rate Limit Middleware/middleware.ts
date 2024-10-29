import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory store for tracking requests per IP or session
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const authLimitMap = new Map<string, { count: number; timestamp: number }>();
const maxMapSize = 100;

// Rate limits for auth vs. general routes
const rateLimits = {
  default: { limit: 30, timeframe: 60 * 1000, map: rateLimitMap },
  auth: { limit: 7, timeframe: 60 * 1000, map: authLimitMap },
};

/*  Boolean that checks the users rate limit: returns false if they exceeded it
 *  req - the users request
 *  field - the rate limit we're using from rateLimits
 */
function checkRateLimit(req: NextRequest, field: keyof typeof rateLimits) {
  const now = Date.now();
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const map = rateLimits[field].map;
  if (map.size > maxMapSize) {
    clearRateLimitMaps();
  }
  if (!map.has(ip)) {
    // Initialize the rate limit entry for this IP
    map.set(ip, { count: 1, timestamp: now });
  } else {
    const data = map.get(ip)!;
    // Check if the request is within the time frame
    if (now - data.timestamp < rateLimits[field].timeframe) {
      if (data.count >= rateLimits[field].limit) {
        // Limit exceeded
        console.log(map);
        console.log("Too many requests, stop it");
        return false;
      }
      // Increment count if limit not exceeded
      data.count += 1;
    } else {
      // Reset the count and timestamp if the time frame has passed
      map.set(ip, { count: 1, timestamp: now });
    }
  }
  console.log(map);
  return true;
}

//Clears the rate limit maps of old entries so they don't become too large and sluggish
function clearRateLimitMaps() {
  let now = Date.now();
  Object.values(rateLimits).forEach((rateLimit) => {
    rateLimit.map.forEach((entry, ip) => {
      if (now - entry.timestamp > rateLimit.timeframe) {
        rateLimit.map.delete(ip);
      }
    });
  });
}

//Middleware function
export function middleware(req: NextRequest) {
  //Does rate limiting for API routes
  if (req.nextUrl.pathname.startsWith("/api")) {
    let withinRateLimit;
    if (req.nextUrl.pathname.startsWith("/api/auth")) {
      withinRateLimit = checkRateLimit(req, "auth");
    } else {
      withinRateLimit = checkRateLimit(req, "default");
    }
    if (!withinRateLimit) {
      return new Response("Too Many Requests", { status: 429 });
    }
  }

  NextResponse.next();
}
