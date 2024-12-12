import mongoose from "mongoose";

const SignupSchema=new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Editor', 'Viewer'], default: 'Viewer' },
})

SignupSchema.pre('save', async function (next) {
    const User = mongoose.model("Signup", SignupSchema);
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        this.role = 'Admin';
    }
    next();
});

export default mongoose.model('Signup',SignupSchema);