const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");

const getUser = (req, res) => {
  res.send("it's works");
};

const getProfile = async (req, res) => {
  const profile = await prisma.user.findMany();
  res.status(200);
};

const userRegister = async (req, res) => {
  const { Nama, Email, Password } = req.body;
  try {
    const hashedPassword = bcrypt;
    const user = await prisma.user.create({
      data: {
        Nama,
        Email,
        Password,
      },
    });
    res.status(200).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.log(error);
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

    const user = await prisma.user.findUnique({ where: { Email, Password } });
    if (!user) {
      res.status(401).json({ message: "Email atau Password salah" });
    }

    res.status(200).json({ message: "Login berhasil" });
  } catch (error) {
    console.log(error);
  }
};

const buatPost = async (req, res) => {
  const { UserID, Judul, Deskripsi, Kategori, Media } = req.body;
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

const userComments = async (req, res) => {
  const { PostID, UserID, IsiKomentar } = req.body;
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
  const { PostID, UserID } = req.body;
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

module.exports = {
  getUser,
  getProfile,
  userRegister,
  userLogin,
  userComments,
  buatPost,
  getcomment,
  deletComment,
  userLike,
  deletlike,
};
