import User from "@/models/user.model";

export const getUserByIdService = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};
