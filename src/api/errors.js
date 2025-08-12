export class ApiError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
  }
}
