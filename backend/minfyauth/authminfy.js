


const authminfy = async (req,res,next)=>{
    try{
        const minfyemail = [
"boddupally.rohan@minfytech.com",
"midhilesh.polisetty@minfytech.com",
"voma.sreeja@minfytech.com",
"rakesh.ravi@minfytech.com"
]
const {email} = req.body
console.log(email)

minfyemail.forEach(element => {
    if(element.trim().toLowerCase().toString()===email.trim().toLowerCase().toString()){
        console.log("Verified")
        next()
    }
});
console.log("Not verified")



    }catch(e){
        return res.status(500).json({"success":false,"message":"Server error"})
    }
}
export default authminfy