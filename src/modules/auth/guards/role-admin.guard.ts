import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";

@Injectable()
export class OnlyAdminGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

		if (!user || user.role !== 'ADMIN')
      throw new ForbiddenException('You do not have permission to access this resource');

    return true;
	}
}