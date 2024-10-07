import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Navbar, NavbarModelType, NavbarType, Prisma } from '@prisma/client';
import { CreateNavbarItemDto } from 'src/modules/navbar/dto/create-navbar-item.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class NavbarRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(where?: Prisma.NavbarWhereInput): Promise<Navbar[]> {
    return await this.prismaService.navbar.findMany({ where });
  }

  async create(
    data: CreateNavbarItemDto,
    navbarType: NavbarType,
  ): Promise<Navbar> {
    let modelTitle: string;

    if (data.model_type === NavbarModelType['categories']) {
      const existsCategory = await this.prismaService.category.findFirst({
        where: { slug: data.slug },
      });

      if (!existsCategory) modelTitle = 'Category';
    }

    if (data.model_type === NavbarModelType['products']) {
      const existsProduct = await this.prismaService.product.findFirst({
        where: { slug: data.slug },
      });

      if (!existsProduct) modelTitle = 'Product';
    }

    if (data.model_type === NavbarModelType['tags']) {
      const existsTag = await this.prismaService.tag.findFirst({
        where: { slug: data.slug },
      });

      if (!existsTag) modelTitle = 'Tag';
    }

    if (modelTitle)
      throw new BadRequestException(`${modelTitle} not found with this slug`);

    const newNavbarItem = await this.prismaService.navbar.create({
      data: {
        ...data,
        image: '/images/' + data.image?.path || null,
        type: navbarType,
      },
    });

    return newNavbarItem;
  }

  async remove(slug: string): Promise<void> {
    const existsNavbarItem = await this.prismaService.navbar.findFirst({
      where: { slug },
    });
    if (!existsNavbarItem)
      throw new NotFoundException(
        'Navbar item not found with this slug. SLUG: ' + slug,
      );

    await this.prismaService.navbar.delete({
      where: { id: existsNavbarItem.id },
    });
  }
}
