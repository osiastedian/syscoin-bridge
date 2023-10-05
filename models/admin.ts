import mongoose from "mongoose";

export interface IAdmin extends mongoose.Document {
  address: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new mongoose.Schema<IAdmin>({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "Admin",
  },
});

AdminSchema.set("timestamps", true);

const generateModel = () => mongoose.model("Admin", AdminSchema);

let model: ReturnType<typeof generateModel> = mongoose.models.Admin;

if (!model) {
  model = generateModel();
}

export default model;
