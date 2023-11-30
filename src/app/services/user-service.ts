import { User, type UserType } from "../database";
import { hash } from "bcrypt";

type CreateUserDto = UserType;

export type UserWithId = UserType & { _id: string };

export class UserService {
  public async createUser(createUserDto: CreateUserDto): Promise<void> {
    const userExists = await this.findUserByEmail(createUserDto.email);

    if (userExists) {
      throw new Error("User already exists");
    }

    const passwordHash = await hash(createUserDto.password, 8);

    const user = new User({
      email: createUserDto.email,
      name: createUserDto.name,
      password: passwordHash,
      tasks: [],
    });

    await user.save();
  }

  async findUserByEmail(email: string): Promise<UserWithId | null> {
    return await User.findOne({ email });
  }
}

export const userService = new UserService();
