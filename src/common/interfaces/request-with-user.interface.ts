import { Request } from "express";
import { IUser } from "src/repositories/interfaces/user.interface";

export interface RequestWithUser extends Request {
	user: IUser
}