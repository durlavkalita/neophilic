declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
      };
    }
  }
}
