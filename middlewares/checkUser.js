const prisma = require("../prisma/client");

const checkUser = async (req, res, next) => {
  try {
    console.log({ id: req.UserID });
    const user = await prisma.user.findUnique({
      where: {
        UserID: req.UserID,
      },
    });
    console.log({ user });
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = checkUser;
