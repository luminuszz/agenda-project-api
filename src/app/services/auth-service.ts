import { userService, type UserWithId } from "./user-service";
import { compare } from "bcrypt";

export class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<{ isLogged: boolean; user: UserWithId | null }> {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return {
        isLogged: false,
        user: null,
      };
    }

    const isLogged = await compare(password, user.password);

    return {
      isLogged,
      user: isLogged ? user : null,
    };
  }
}

export const authService = new AuthService();
