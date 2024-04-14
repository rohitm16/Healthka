export class CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;

  constructor(message: string, statusCode?: number) {
    super(message);

    this.statusCode = statusCode;
    this.status =
      statusCode && statusCode >= 400 && statusCode < 500
        ? "fail"
        : statusCode && `${statusCode}`.startsWith("4")
        ? "fail"
        : "error";
    this.isOperational = true;
  }

  toJSON(): { message: string; statusCode?: number; status?: string } {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
    };
  }
}
