import mongoose from "mongoose"
import bcrypt from "bcryptjs"



const userSchema = new mongoose.Schema({
    username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    email:{type: String, required: true, unique: true}
},{timestamps: true})


//Hash passsword

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.compare(this.password, 10);
    next();
})


//ComparePassword

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);