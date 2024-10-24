import { MetadataRoute} from "next";
import { fetchCategories } from "@/src/_data/categories";


export default async function sitemap():Promise<MetadataRoute.Sitemap>{
    const { categories } = await fetchCategories();
    const categoryEntries: MetadataRoute.Sitemap = categories.map((category)=>(
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}categories/${encodeURIComponent(category.name.trim()
                .replace(/\s+/g, "-")
                .toLowerCase())}-${category.id}`
        }
    ))
    const productEntries: MetadataRoute.Sitemap = categories.flatMap((category) =>
        category.products.map((product) => ({
          url: `${process.env.NEXT_PUBLIC_BASE_URL}products/${encodeURIComponent(
            product.name.trim().replace(/\s+/g, "-").toLowerCase()
          )}-${product.id}`,
        }))
      );
      
    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`
        },
        ...categoryEntries,
        ...productEntries,
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/search`
        }
    ]
}