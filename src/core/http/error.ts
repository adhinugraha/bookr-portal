export class AppError extends Error {
  public statusCode: number;
  public data: any;
  public success: boolean;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.data = {};
  }
}

export class VendorError extends AppError {
  constructor(message: string, statusCode = 502) {
    super("Vendor error: " + message, statusCode);
  }
}

