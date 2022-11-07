import { Request, Response, NextFunction } from "express";

export const validRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, cf_password } = req.body;

  if (!username || !email || !password || !cf_password) {
    return res.status(400).json({ error: "Bạn cần nhập đầy đủ các trường" });
  }

  if (!validEmail(email)) {
    return res.status(400).json({ error: "Email không hợp lệ" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Mật khẩu ít nhấp 6 ký tự" });
  }

  if (password !== cf_password) {
    return res.status(400).json({ error: "Mật khẩu nhập lại không khớp" });
  }

  next();
};

export const validEmail = (email: any) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
