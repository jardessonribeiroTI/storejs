import { EntityRepository, ILike, Repository } from 'typeorm';
import { Product } from '../models/Product';

interface ProductsUpdate{
    id_product: string;
    name_product: string;
    value_product: number;
    quantity_product: number;
    value_total_product: number;
}

@EntityRepository(Product)
class ProductRepository extends Repository<Product> {
    async getAllProductsOrderEmphasisRepository(){

        try {
            const result = this.find({where: {emphasis_product: true}, take: 20, skip: 0, order: {created_at: 'DESC'}})

            return result;
        } catch (error) {
            throw new error;
        }
    }

    async getArrayPagination(limit = 3){
      const arrayPagination = [];

      try {
        const count = await this.count();
        for (let i = 1; i <= Math.ceil(count / limit); i++) {
          arrayPagination.push(i);
        }

        return arrayPagination;
      } catch (error) {
        throw error;
      }
    }

    async getProductsForPageRepository(page: number){
        const numberOfProducts = 3;
        const offSet = (page - 1) * numberOfProducts;
        const numberOfProductsLimit = numberOfProducts * page;
        let pagination: number[];

        try {
          pagination = await this.getArrayPagination(numberOfProducts);
        } catch (error) {
          throw error;
        }

        try {
            const result = await this.find({take: numberOfProductsLimit, skip: offSet, order: {created_at: 'DESC'}})

            return {result, pagination};

        } catch (error) {
            console.log("Error na getAll ... :", error);
        }
    }
    async getProductByLikeNameRepository(nameProduct: string){

        try {
            const result = await this.find({name_product: ILike(`%${nameProduct}%`)})

            return result;
        } catch (error) {
            console.log("Error na getAll ... :", error);
        }
    }
    async getProductBySpecificNameRepository(nameProduct: string){

        try {
            const result = await this.find({where: {name_product: nameProduct}, take: 1});
            return result;
        } catch (error) {
            console.log("Error na getAll ... :", error);
        }
    }

    async decrementQuantityStockProduct(productSale: ProductsUpdate[]){

        try {
            const result =  productSale.map(async (product: ProductsUpdate) => {
                const [ Product ]  = await this.find({select: ['amount_stock_product'], where: {id_product: product.id_product}})
                const differenceQuantity = Product.amount_stock_product - product.quantity_product;
                if(differenceQuantity >= 0){
                    return await this.update(product.id_product, {amount_stock_product: differenceQuantity});
                }
            })

        } catch (error) {

        }
    }
}

export { ProductRepository };
