import mongoose from "mongoose"
const artistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
})
const Artist = mongoose.model("Artist", artistSchema)
export default Artist
