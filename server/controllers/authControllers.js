import User from "../models/userModel.js";
import bcrypt from 'bcrypt'
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);


		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			fullName,
			userName: username ,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		if (newUser) {
			// Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.userName,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const login = async (req,res)=>{
  try {
	const { userName, password} = req.body;
	const user = await User.findOne({ userName })
	const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

	if(!user || !isPasswordCorrect){
		return res.status(400).json({ error: 'invalid credentials'})
	}

	generateTokenAndSetCookie(user._id, res)

	res.status(201).json({
		_id: user._id,
		fullName: user.fullName,
		userName: user.userName,
		profilePic: user.profilePic
	})

  } catch (error) {
	res.status(500).json({error: error.message});
  }
};

export const logout = (req,res) => {
    try {
		res.cookie('jwt', "", { maxAge: 0});
		res.status(200).json({message: 'logged out successfully'});
	} catch (error) {
		res.status(500).json({error: 'internal Server Error'})
	}
}
