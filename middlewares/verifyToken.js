const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const cookie = req.cookies.token;
  console.log({ cookie });
  const token = req.header("Authorization")?.split(" ")[1];
  console.log({ token });
  if (!token || !cookie) {
    return res.status(401).json({ message: "Token atau cookie tidak ada!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.UserID = decoded.UserID;
    req.Nama = decoded.Nama;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
  console.log({ token });
};
module.exports = verifyToken;
