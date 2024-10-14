import { Injectable, NotFoundException } from '@nestjs/common';
import { PromoRepository } from 'src/repositories/promo.repository';
import { HomePagePromoDto } from './dto/home-page-promo.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { IPromo } from 'src/repositories/interfaces/promo.interface';

@Injectable()
export class PromoService {
  constructor(private readonly promoRepository: PromoRepository) {}

	async createPromo(dto: CreatePromoDto): Promise<IPromo> {
		const newPromo = await this.promoRepository.create({
			...dto,
			image: dto.image?.filename
		});

		return newPromo;
	}

  async findAll(): Promise<IPromo[]> {
    const promos = await this.promoRepository.findAll({
			type: { notIn: [ 'main_left', 'main_right' ] }
		});
		return promos.map(promo => ({
			...promo,
			image: promo.image ? process.env.BASE_URL + '/images/' + promo.image : null
		}));
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
				image: process.env.BASE_URL + '/images/' + left.image,
				product: {
					id: left.product.id,
					title: left.product.title,
					slug: left.product.slug,
					price: left.product.price,
					brand: {
						id: left.product.brand.id,
						title: left.product.brand.title,
						slug: left.product.brand.slug
					},
					thumbnail: left.product?.images
						? process.env.BASE_URL + '/images/' + left.product.images[0].path : null,
				}
			},
			right: {
				id: right.id,
				title: right.title,
				type: 'main_right',
				body: right.body,
				image: process.env.BASE_URL + '/images/' + right.image,
				product: {
					id: right.product.id,
					title: right.product.title,
					slug: right.product.slug,
					price: right.product.price,
					brand: {
						id: right.product.brand.id,
						title: right.product.brand.title,
						slug: right.product.brand.slug
					},
					thumbnail: process.env.BASE_URL + '/images/' + right.image
				}
			}
		}
  }

	async delete(id: string) {
		await this.promoRepository.delete({ id });
	}
}
