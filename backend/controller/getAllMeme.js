// import usermodel from "../models/User"
import mememodel from '../models/MemeModel'
const getAllMeme = async (req, res) => {
  try {
    const user = req.user;

    const allmemes = await mememodel
      .find()
      .populate('author', 'username')
      .populate('likes', 'username'); // optional: populate like user info

      
     const displaymeme = allmemes.filter((meme)=>{
            return meme.author._id.toString()!==user.id.toString()
        })
  
    return res.status(200).json({ data: displaymeme });
  } catch (e) {
    return res.status(500).json({ message: 'fail', error: e.message });
  }
};

export default getAllMeme