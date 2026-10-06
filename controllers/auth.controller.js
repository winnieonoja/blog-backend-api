import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendError, sendSuccess } from "../utils/response.js";




// register user 
export const registerUser = async (req, res) => {
  try{
    const { firstName, lastName, userName, email, password } = req.body;

    // check required fields
    if(!firstName || !lastName || !userName || !email || !password){
      return sendError(
        res,
        400,
        "All fields are required"
      );
    }

  const normalizeEmail = email.toLowerCase();

  // check if email already exist
  const existingEmail = await User.findOne({email: normalizeEmail});
  if(existingEmail){
    return sendError(
      res,
      409,
      "This email already exist"
    )
  }

    const normalizeUserName = userName.toLowerCase();

  // check if username alraedy exist
const existingUserName = await User.findOne({userName: normalizeUserName});
if(existingUserName){
  return sendError(
    res,
    409,
    "This username already exist"
  );
}

// check if password is upto 6 characters
if (password.length < 6) {
  return sendError(
    res,
    400,
    "Password must be at least 6 characters"
  );
}

// hash password
const hashedPassword = await bcrypt.hash(password, 10);

// create user
const user = await User.create({
  firstName,
  lastName,
  userName: normalizeUserName,
  email: normalizeEmail,
  password: hashedPassword,
});

return sendSuccess(
  res,
  201,
  "User created successfully",
  {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email
    },
  }
);


  }catch(error){
    console.error("Register user error:", error);

    return sendError(
      res,
      500,
      "Failed to register user",
      error.message
    );
  }
};



// login user
export const loginUser = async (req, res) => {
  try{
    const {email, password} = req.body;

    if (!email || !password) {
      return sendError(
        res,
        400,
        "Email and password are required"
      );   
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user){
      return sendError(
        res,
        401,
        "Invalid email or password",
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect){
      return sendError(
        res,
        401,
        "Invalid email or password",
      );
    }

    // token
     const token = jwt.sign(
      { userId: user._id, role: user.role},
      process.env.JWT_SECRET,
      {expiresIn: "7d",}
    );


    return sendSuccess(
  res,
  200,
  "Login successful",
  
  {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },

    accessToken:token,

  }
);

  }catch(error){
    console.error("Login error:", error);

    return sendError(
      res,
      500,
      "Failed to login",
      error.message
    );
  }
};