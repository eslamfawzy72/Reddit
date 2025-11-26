import User from "../Models/User.js";
import Community from "../Models/Community.js"
//get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//get user by id
export async function getUserByID(req,res){
  try{
  const userId=req.params.userID
  const user= await User.findById(userId)
  if(!user){
    res.status(404).json("user not found!")
  }
  res.json(user)
  }catch(err){
    res.status(500).json({err:err.message})
  }
}
//get user by username
export async function getUserByName(req, res) {
  try {
    const username = req.params.username;

    const user = await User.findOne({ userName: username });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUserByID(req,res) {
  try{
    const id=req.params.userID
    const user=await User.findById(id)
    if(!user){
         return res.status(404).json("User not found!");
    }
    const username=user.userName
    await User.deleteOne({_id:id})
    res.json(`user ${username} have been deleted!`)
  }catch(err){
    res.status(500).json({ error: err.message });

  }
}
export async function getUserCommunities(req, res) {
  try {
  const user = await User.findById(req.params.userID).populate("joinedCommunities");

  if (!user) return res.status(404).json("User not found!");

  res.json(user.joinedCommunities);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}






