import { Injectable, NotFoundException } from '@nestjs/common';
import { PromoRepository } from 'src/repositories/promo.repository';
import { HomePagePromoDto } from './dto/home-page-promo.dto';
import { title } from 'process';
import { CreatePromoDto } from './dto/create-promo.dto';
import { IPromo } from 'src/repositories/interfaces/promo.interface';

@Injectable()
export class PromoService {
  constructor(private readonly promoRepository: PromoRepository) {}

	async createPromo(dto: CreatePromoDto): Promise<IPromo> {
		const newPromo = await this.promoRepository.create({
			...dto,
			image: dto.image?.path
		});

		return newPromo;
	}

  async findAll(): Promise<IPromo[]> {
    return await this.promoRepository.findAll();
  }

  async homePagePromo(): Promise<HomePagePromoDto> {
    const left = await this.promoRepository.findOne({ type: 'main_left' });
    const right = await this.promoRepository.findOne({ type: 'main_right' });

    if (!left && !right)
      throw new NotFoundException('Home Page Promo no available now');

		return {
			left: {
				id: left.id,
				title: left.title,
				type: 'main_left',
				body: left.body,
				image: left.image,
				product: {
					id: left.product.id,
					title: left.product.title,
					slug: left.product.slug,
					price: left.product.stocks[0].price,
					brand: {
						id: left.product.brand.id,
						title: left.product.brand.title,
						slug: left.product.brand.slug
					},
					thumbnail: left.image
				}
			},
			right: {
				id: right.id,
				title: right.title,
				type: 'main_right',
				body: right.body,
				image: right.image,
				product: {
					id: right.product.id,
					title: right.product.title,
					slug: right.product.slug,
					price: right.product.stocks[0].price,
					brand: {
						id: right.product.brand.id,
						title: right.product.brand.title,
						slug: right.product.brand.slug
					},
					thumbnail: right.image
				}
			}
		}
  }
}
