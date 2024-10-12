import { Controller, Get } from "@nestjs/common";
import { HomeService } from "./home.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('home')
@ApiTags('Home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {};

	@Get()
	async findHome() {
		return this.homeService.getHomePage();
	}
}