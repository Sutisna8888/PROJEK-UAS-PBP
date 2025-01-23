const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminRegister = async (req, res) => {
  const { NamaAdmin, EmailAdmin, PasswordAdmin } = req.body;
  try {
    if (!NamaAdmin || !EmailAdmin || !PasswordAdmin) {
      return res
        .status(400)
        .json({ message: "NamaAdmin, EmailAdmin, PasswordAdmin harus diisi!" });
    }
    const hashedPassword = await bcrypt.hash(PasswordAdmin, 10);

    const registeredAdmin = await prisma.admin.create({
      data: {
        NamaAdmin,
        EmailAdmin,
        PasswordAdmin: hashedPassword,
      },
    });
    res
      .status(200)
      .json({ message: "Berhasil mendaftarkan admin!", registeredAdmin });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const adminLogin = async (req, res) => {
  const { EmailAdmin, PasswordAdmin } = req.body;

  if (!EmailAdmin || !PasswordAdmin) {
    return res
      .status(400)
      .json({ message: "EmailAdmin dan PasswordAdmin harus diisi!" });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { EmailAdmin },
    });

    const isMatch = await bcrypt.compare(PasswordAdmin, admin.PasswordAdmin);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah!" });
    }

    const token = jwt.sign(
      { AdminID: admin.AdminID, NamaAdmin: admin.NamaAdmin },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res
      .status(200)
      .json({ message: "Berhasil login, selamat datang admin!", token });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const adminLogout = (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({ message: "Logout berhasil!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log({ users });
    res.status(200).json({ message: "Berhasil mendapatkan data users", users });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const deleteUser = async (req, res) => {
  const UserID = req.params.UserID;

  const deleteUser = await prisma.user.delete({
    where: {
      UserID: parseInt(UserID),
    },
  });
  console.log({ deleteUser });
  res
    .status(200)
    .json({ message: "Pengguna berhasil dihapus dengan UserID " + UserID });
  try {
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  adminLogout,
  getUsers,
  deleteUser,
};
