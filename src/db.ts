import mongoose, {model, mongo, Schema} from "mongoose";

const userSchema = new Schema({
    username: { type: String, unique: true},
    password: { type: String},
})

// const tagSchema = new Schema({
//     title: { type: String, required: true, unique: true }
// })

const contentTypes = ['image', 'video', 'article', 'audio' ];

const contentSchema = new Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'tag' }],
    userId: {type: mongoose.Types.ObjectId, ref: 'user', required:true }

})

// const linkSchema = new Schema({
//     hash: { type: String, required: true },
// })


export const userModel = model('user', userSchema);
// export const tagModel = model('tag', tagSchema);
export const contentModel = model('content', contentSchema);
// export const linkModel = model('link', linkSchema);

