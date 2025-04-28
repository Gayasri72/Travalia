import mongoose from 'mongoose';


const hiersSchema = new mongoose.Schema(
    {
        type: String,
        trim: true,
        required : true
    }
);

const Hires = mongoose.model('Hires', hiersSchema);

export default hires;