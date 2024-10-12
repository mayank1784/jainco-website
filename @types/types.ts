export type Category = {
    id: string;
    image: string;
    name: string;
    description: string;
    products: Record<string,string>[];
  };

export type Product = {
    id:string;
    name:string;
    category:string;
    createdAt:string;
    description: string;
    lowerPrice: Number;
    upperPrice: Number;
    mainImage: string;
    otherImages?: string[];
    variationTypes: Record<string,string[]>;
}