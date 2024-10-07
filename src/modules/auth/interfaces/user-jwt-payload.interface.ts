import { JwtPayload } from "jsonwebtoken";

export interface UserJwtPaylod extends JwtPayload {
	user_id: string;
}