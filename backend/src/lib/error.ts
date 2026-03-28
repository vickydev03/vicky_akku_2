export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}

// Specific Domain Errors
export class AuthError extends AppError { constructor(m = "Unauthorized") { super(m, 401) } }
export class ForbiddenError extends AppError { constructor(m = "Forbidden") { super(m, 403) } }
export class NotFoundError extends AppError { constructor(m = "Resource not found") { super(m, 404) } }
export class RateLimitError extends AppError { constructor(m = "Too many requests") { super(m, 429) } }
export class ExternalServiceError extends AppError { constructor(m = "Service Unavailable") { super(m, 503) } }