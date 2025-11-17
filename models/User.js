import mongoose from "mongoose"
import bcrypt from "bcryptjs"



const userSchema = new mongoose.Schema({
    username:{type: String, required: true, unique: true, trim: true, minlength:[3, "Username must be at least 3 characters long"]},
    password:{type: String, required: true, minlength:[8, "Password must be at least 8 characters long"], select: false},
    email:{type: String, required: true, unique: true, trim: true, lowercase: true, match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]},
    role:{type: String, enum:["user","manager", "admin"], default: "user"}
},{timestamps: true})


//Hash passsword

// userSchema.pre("save", async function(next) {
//     if(!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// })

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//ComparePassword

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);