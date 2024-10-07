import { IUser } from "src/repositories/interfaces/user.interface";

export class AuthResponseDto {
	user: IUser;
	access_token: string;
}