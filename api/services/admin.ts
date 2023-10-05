import Admin, { IAdmin } from "../../models/admin";
export class AdminService {
  public async isAdmin(address: string): Promise<boolean> {
    const admin = await Admin.exists({ address }).exec();

    return admin !== null;
  }

  public async getAdmin(address: string): Promise<IAdmin | null> {
    const admin = await Admin.findOne({ address }).exec();
    if (!admin) {
      return null;
    }

    return admin;
  }

  public async createAdmin(address: string, name: string): Promise<IAdmin> {
    // Check if address is already an admin
    const isAdmin = await this.isAdmin(address);

    if (isAdmin) {
      throw new Error("Address is already an admin");
    }

    const admin = new Admin({ address, name });

    return await admin.save();
  }
}
