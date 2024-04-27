import { db } from "../db.js"
import jwt from "jsonwebtoken"

export const authenticate = (req, res) => {
    const { username, password } = req.body;
    const q = "select * from users where username = ?";
    
    db.query(q, [username], (err, data) => {
        if (err) return res.json(err);
        
        if (data.length === 0) {
            const insertQuery = "INSERT INTO users (`username`,`password`) VALUES (?, ?)";
            const values = [username, password];
            
            db.query(insertQuery, values, (err, result) => {
                if (err) return res.json(err);
                
                res.status(200).json("User has been created.");
            });
        } else {
            const isPasswordCorrect = (data[0].password === req.body.password);
            
            if (!isPasswordCorrect) {
                return res.status(400).json("Wrong email or password!");
            }
            
            const token = jwt.sign({ id: data[0].id }, `${process.env.JWT_SECRET}`);
            const { password, ...userData } = data[0];
            
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(userData);
        }
    });
};

export const logout = (req, res) => {
    res.clearCookie("access_token",{
      sameSite:"none",
      secure:true
    }).status(200).json("User has been logged out.")
};