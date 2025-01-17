const prisma = require("../prisma/client");
const bcrypt = require('bcrypt')

const getUser = (req, res) => {
  res.send("it's works");
};

const getProfile = async (req, res) => {
  const profile = await prisma.user.findMany();
  res.status(200);
};

const userRegister = async (req, res) => {
   const {Nama, Email, Password} = req.body;
   try{ 
   const hashedPassword = bcrypt.
      const user = await prisma.user.create({
         data: {
           Nama,
           Email,
           Password,
         },
       });
       res.status(200).json(({ message: 'Registrasi berhasil'}));
   } catch (error){
      console.log(error);
   } 
};

const userLogin = async (req, res) => {
   try{
      const { Email, Password } = req.body;
      if (!Email || !Password) {
         return res.status(400).json({ message: "Email dan Password wajib diisi" });
       }

      const user = await prisma.user.findUnique({ where: { Email, Password } });
      if (!user) {
         res.status(401).json({message: "Email atau Password salah"})
      }

      res.status(200).json({ message: 'Login berhasil' });
   } catch (error) {
      console.log(error);
   }
}


module.exports = {getUser, getProfile, userRegister, userLogin};
