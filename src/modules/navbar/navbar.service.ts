import { Injectable } from '@nestjs/common';
import {
  FooterResponseDto,
  HeaderResponseDto,
  NavbarResponseDto,
} from './dto/navbar-response.dto';
import { CreateNavbarItemDto } from './dto/create-navbar-item.dto';
import { NavbarRepository } from 'src/repositories/navbar.repository';
import { Navbar, NavbarType } from '@prisma/client';

@Injectable()
export class NavbarService {
  constructor(private readonly navbarRepository: NavbarRepository) {}

  async getHeader(): Promise<HeaderResponseDto> {
    const header = await this.navbarRepository.findAll({
      type: NavbarType['header'],
    });
    return { header: this.formatNavbar(header) };
  }

  async getFooter(): Promise<FooterResponseDto> {
    const footer = await this.navbarRepository.findAll({
      type: NavbarType['footer'],
    });
    return { footer: this.formatNavbar(footer) };
  }

  async createNavbarItem(
    dto: CreateNavbarItemDto,
    navbarType: NavbarType,
  ): Promise<NavbarResponseDto> {
    await this.navbarRepository.create(dto, navbarType);
    return { title: dto.text, slug: dto.slug, type: dto.model_type, image: dto.image?.path || null };
  }

	async removeNavbarItem(slug: string) {
		await this.navbarRepository.remove(slug);
	}

  private formatNavbar(navbar: Navbar[]): NavbarResponseDto[] {
    return navbar.map((item) => ({
      title: item.text,
      slug: item.slug,
      type: item.model_type,
			image: item.image || null,
    }));
  }
}
