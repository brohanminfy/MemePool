import mememodel from "../models/MemeModel";

const likeMeme = async (req,res)=>{
    try{
        const user = req.user
        const memeId = req.params.id
       
        if(!memeId){
            return res.status(401).json({"success":"fail","error":"No meme id"})
        }
        const meme = await mememodel.findById(memeId)
       
        if(!meme){
            return res.status(401).json({"success":"fail",'message':"Meme not found"})
        }
        if(meme.author.toString()===user.id.toString()){
            return res.status(403).json({"sucess":false,"error":"You can't like your own meme dude"})
        }
       const liked =  meme.likes.includes(user.id)
    //    console.log(liked)
       if(liked){
        console.log("Remove like")
        meme.likes = meme.likes.filter((id)=>{
            console.log(id,user.id)
                return id.toString()!==user.id.toString()
        })
       }
       else{
        meme.likes.push(user.id)
       }
       await meme.save()
    //    console.log(liked)
      return res.status(200).json({
         message: liked ? "meme unliked" : "meme liked",
        likes: meme.likes
    });
    }catch(e){
        console.log(e)
        return res.status(500).json({"message":"Internal error"})
    }
}
export default likeMeme