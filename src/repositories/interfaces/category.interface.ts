import { Prisma } from '@prisma/client';
export interface CreateCategory {
  title: string;
  description: string;
  parent_id: string;
}

export type ICategory = Prisma.CategoryGetPayload<{
  include: {
    images: true;
    children: {
      include: { images: true };
    };
    products: {
      include: {
        brand: true;
        images: true;
        stocks: true;
        tags: true;
      };
    };
  };
}>;

// export interface ICategory extends Category {
// 	images: IMedia[];
// 	children: IChildren[];
// 	products: IProduct[];
// }
