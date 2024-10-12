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
    return { header: header.map(item => this.formatNavbar(item)) };
  }

  async getFooter(): Promise<FooterResponseDto> {
    const footer = await this.navbarRepository.findAll({
      type: NavbarType['footer'],
    });
    return { footer: footer.map(item => this.formatNavbar(item)) };
  }

  async createNavbarItem(
    dto: CreateNavbarItemDto,
    navbarType: NavbarType,
  ): Promise<NavbarResponseDto> {
    const newNavbarItem = await this.navbarRepository.create(dto, navbarType);
    return this.formatNavbar(newNavbarItem);
  }

	async removeNavbarItem(slug: string) {
		await this.navbarRepository.remove(slug);
	}

  private formatNavbar(navbar: Navbar): NavbarResponseDto {
    return {
			title: navbar.text,
      slug: navbar.slug,
      type: navbar.model_type,
			image: navbar.image || null,
		}
  }
}
