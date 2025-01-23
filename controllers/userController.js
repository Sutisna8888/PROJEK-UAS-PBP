const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getProfile = async (req, res) => {
  try {
    const profile = await prisma.user.findMany();
    if (!profile) {
      return res
        .status(404)
        .json({ message: "data profile tidak ada", profile });
    }
    console.log({ profile });
    res.status(200).json({ message: "data berhasil diambil", profile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const getProfileById = async (req, res) => {
  const id = req.params.id;
  try {
    const profile = await prisma.user.findUnique({
      where: {
        UserID: parseInt(id),
      },
    });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "data profile tidak ada", profile });
    }
    res.status(200).json({ message: "data berhasil diambil", profile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const userRegister = async (req, res) => {
  const { Nama, Email, Password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log({ hashedPassword });
    const user = await prisma.user.create({
      data: {
        Nama,
        Email,
        Password: hashedPassword,
      },
    });
    res.status(200).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res
        .status(400)
        .json({ message: "Email dan Password wajib diisi" });
    }
    const user = await prisma.user.findUnique({ where: { Email } });
    console.log({ user });
    if (!user) {
      return res.status(401).json({ message: "Email atau Password salah" });
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    console.log({ isMatch });
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { UserID: user.UserID, Nama: user.Nama },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({ message: "Login berhasil", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "berhasil logout!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const editUser = async (req, res) => {
  const UserID = req.UserID;
  const { Nama, Email, Password } = req.body;
  try {
    const user = await prisma.user.findMany({
      where: {
        UserID,
      },
    });

    console.log({ user });
    if (!user) {
      return res.status(400).json({ message: "User tidak ada!" });
    }
    if (!Nama || !Email || !Password) {
      return res
        .status(400)
        .json({ message: "Nama, Email, Password harus diisi!" });
    }
    const hashedPassword = await bcrypt.hash(Password, 10);
    const userUpdate = await prisma.user.update({
      where: {
        UserID,
      },
      data: {
        Nama,
        Email,
        Password: hashedPassword,
      },
    });
    res.status(200).json({ message: "User berhasil diupdate!", userUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    console.log({ posts });
    res
      .status(200)
      .json({ message: "Berhasil mengambil data postingan", posts });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const buatPost = async (req, res) => {
  const UserID = req.UserID;
  const { Judul, Deskripsi, Kategori, Media } = req.body;
  try {
    if (!UserID || !Judul || !Deskripsi || !Kategori) {
      return res
        .status(400)
        .json({ error: "UserID, Judul, Deskripsi, dan Kategori wajib diisi." });
    }
    const cariUser = await prisma.user.findUnique({ where: { UserID } });
    if (!cariUser) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }
    const post = await prisma.post.create({
      data: {
        UserID,
        Judul,
        Deskripsi,
        Kategori,
        Media,
      },
    });
    res.status(201).json({
      message: "Berhasil Memposting",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

const getPostById = async (req, res) => {
  const PostID = req.params.PostID;
  console.log({ PostID });
  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(PostID) },
    });
    res.status(200).json({
      message: "Berhasil mengambil postingan berdasarkan PostID",
      post,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

const editPost = async (req, res) => {
  const PostID = req.params.PostID;
  const { Judul, Deskripsi, Kategori, Media } = req.body;

  try {
    const updatePost = await prisma.post.update({
      where: {
        PostID: parseInt(PostID),
      },
      data: {
        Judul,
        Deskripsi,
        Kategori,
        Media,
      },
    });
    res.status(200).json({
      message: "Berhasil memperbarui postingan dengan PostID " + PostID,
      updatePost,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const userComments = async (req, res) => {
  const UserID = req.UserID;
  const { PostID, IsiKomentar } = req.body;
  try {
    if (!PostID || !UserID || !IsiKomentar) {
      return res
        .status(400)
        .json({ message: "PostId, UserID, IsiKomentar Harus Diisi" });
    }

    const cekPost = await prisma.post.findUnique({ where: { PostID } });
    const cekUser = await prisma.user.findUnique({ where: { UserID } });
    if (!cekPost) {
      return res.status(404).json({ message: "PostID tidak ditemukan " });
    }
    if (!cekUser) {
      return res.status(404).json({ message: "UserID tidak ditemukan " });
    }

    const comment = await prisma.comment.create({
      data: { UserID, PostID, IsiKomentar },
    });

    res
      .status(200)
      .json({ message: "Berhasil mengomentari postingan", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

const getcomment = async (req, res) => {
  try {
    const { PostID } = req.params;

    if (!PostID) {
      return res.status(400).json({ error: "PostID wajib disertakan." });
    }

    const postExists = await prisma.post.findUnique({
      where: { PostID: parseInt(PostID) },
    });
    if (!postExists) {
      return res.status(404).json({ error: "Post tidak ditemukan." });
    }

    const comments = await prisma.comment.findMany({
      where: { PostID: parseInt(PostID) },
      include: {
        user: {
          select: {
            Nama: true,
            Email: true,
          },
        },
      },
    });

    if (comments.length === 0) {
      return res
        .status(200)
        .json({ message: "Belum ada komentar untuk post ini.", comments: [] });
    }

    res
      .status(200)
      .json({ message: "Data komentar berhasil diambil.", comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

const deletComment = async (req, res) => {
  try {
    const { CommentID } = req.params;
    if (!CommentID) {
      return res.status(400).json({ message: "CommentID harus diisi" });
    }

    const cekcomment = await prisma.comment.findUnique({
      where: { CommentID: parseInt(CommentID) },
    });
    if (!cekcomment) {
      return res.status(404).json({ message: "CommentID tidak ditemukan" });
    }
    await prisma.comment.delete({ where: { CommentID: parseInt(CommentID) } });

    res.status(200).json({ message: "komentar berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "kesalahan pada server" });
  }
};

const userLike = async (req, res) => {
  const UserID = req.UserID;
  const { PostID } = req.body;
  try {
    if (!PostID || !UserID) {
      return res.status(400).json({ message: "PostID dan UserID harus diisi" });
    }
    const cekPost = await prisma.post.findUnique({ where: { PostID } });
    const cekUser = await prisma.user.findUnique({ where: { UserID } });
    if (!cekPost) {
      return res.status(404).json({ message: "PostID tidak ditemukan" });
    }
    if (!cekUser) {
      return res.status(404).json({ message: "UserID tidak ditemukan" });
    }

    const cekLike = await prisma.like.findFirst({
      where: { PostID, UserID },
    });

    if (cekLike) {
      return res
        .status(400)
        .json({ message: "Anda sudah memberikan like pada post ini." });
    }

    const like = await prisma.like.create({
      data: { PostID, UserID },
    });

    res.status(200).json({ message: "berhasil memberikan like" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "terjadi kesalahan pada server" });
  }
};

const deletlike = async (req, res) => {
  try {
    const { LikeID } = req.params;
    if (!LikeID) {
      return res.status(400).json({ message: "LikeID harus diisi" });
    }
    const ceklike = await prisma.like.findUnique({
      where: { LikeID: parseInt(LikeID) },
    });
    if (!ceklike) {
      return res.status(404).json({ message: "LkeID tidak ditemukan" });
    }
    await prisma.like.delete({ where: { LikeID: parseInt(LikeID) } });

    res.status(200).json({ message: "berhasil menghapus like" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "terjadi kesalahan pada serever" });
  }
};

const deletePost = async (req, res) => {
  const PostID = req.params.PostID;
  try {
    const deletePost = await prisma.post.delete({
      where: {
        PostID: parseInt(PostID),
      },
    });
    res.status(200).json({
      message: "Berhasil menghapus postingan! dengan PostID " + PostID,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const userReport = async (req, res) => {
  const UserID = req.UserID;
  const { PostID, AlasanLaporan } = req.body;

  try {
    const report = await prisma.report.create({
      data: {
        UserID: parseInt(UserID),
        PostID: parseInt(PostID),
        AlasanLaporan: AlasanLaporan,
      },
    });

    res.status(200).json({
      message:
        "Berhasil memberikan report pada postingan dengan PostID " + PostID,
      report,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany();
    res
      .status(200)
      .json({ message: "Berhasil mendapatkan data laporan!", reports });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Terjadi kesalahan pada server!" });
  }
};

module.exports = {
  getProfile,
  getProfileById,
  userRegister,
  userLogin,
  userLogout,
  editUser,
  userComments,
  getPosts,
  buatPost,
  getPostById,
  editPost,
  getcomment,
  deletComment,
  userLike,
  deletlike,
  deletePost,
  userReport,
  getReports,
};
