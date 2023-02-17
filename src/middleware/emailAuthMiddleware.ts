const dB = require('../models/index')


const verifyAuthUser = async (req: any, res: any, next: any) => {
  // Get the user from jwt token and id to req object 

  const token = req.header("auth-token");
  // console.log(token)
  if (!token) {
    return res.status(401).json({ msg: 'You need to sign in first' });
  }
  try {
    const loginInfo = await dB.logininfo.findOne({
        where: {
            usersession: token,
        },
        include: [dB.user],
    });
    // console.log(loginInfo)

    req.userId = loginInfo.user.id;
    req.logininfoUuid = loginInfo.uuid

    next();
    console.log("authenticated")

  } catch (error) {
    res.status(401).send({ error: "Token not verified" });
  }

}


module.exports = {
    verifyAuthUser
}
















