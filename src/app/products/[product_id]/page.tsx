import React from "react";
import { fetchProductData } from "@/src/_data/product";
import type { Category, Product } from "@/@types/types";
import { notFound } from "next/navigation";
import { fetchCategories } from "@/src/_data/categories";
import RelatedProducts from "./relatedProducts";
import { stripHtmlTags } from "@/src/lib/utils";
import { getCombinationsWithKeys } from "@/src/lib/utils";

interface ProductPageProps {
  productData: Product;
  categoryData: Category;
}

const ProductPage: React.FC<ProductPageProps> = ({
  productData,
  categoryData,
}) => {
  const productDescription = stripHtmlTags(productData.description);

 

  // Assuming productData.variationTypes is defined and contains the variation data
  const variationCombinations = getCombinationsWithKeys(
    productData.variationTypes
  );

  const variants = variationCombinations.map((combination) => {
    const queryParameters = new URLSearchParams();

    // Add each key-value pair from the combination to the query parameters
    for (const [key, value] of Object.entries(combination)) {
      queryParameters.append(
        encodeURIComponent(key),
        encodeURIComponent(value)
      );
    }

    const baseUrl = `https://jaincodecor.com/products/${productData.name
      .replace(/\s+/g, "-")
      .toLowerCase()}-${productData.id}`;
    const fullUrl = `${baseUrl}?${queryParameters.toString()}`;

    return {
      "@type": "Product",
      name: `${productData.name} (${Object.values(combination).join(", ")})`,
      sku: `(${Object.values(combination).join(", ")})`,
      url: fullUrl,
      image:productData.mainImage,
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: productData.lowerPrice,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
      additionalProperty: Object.entries(combination).map(([key, value]) => ({
        "@type": "PropertyValue",
        name: key,
        value: value,
      })),
    };
  });

  const jsonLdData = () => {
    const relatedProducts = categoryData.products
      .filter((prod) => prod.id !== productData.id)
      .map((prod) => {
        return {
          "@type": "Product",
          name: prod.name,
          url: `https://jaincodecor.com/products/${prod.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${prod.id}`,
          image: prod.image,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: productData.lowerPrice,
            availability: "https://schema.org/InStock",
          },
        };
      });

    return {
      "@context": "https://schema.org",
      "@type": "ProductGroup",
      name: productData.name,
      description: productDescription,
      image: productData.mainImage,
      brand: {
        "@type": "Brand",
        name: "Jainco Decor",
      },
      url: `https://jaincodecor.com/products/${productData.name
        .replace(/\s+/g, "-")
        .toLowerCase()}-${productData.id}`,
      category: {
        "@type": "Thing",
        name: categoryData.name,
        url: `https://jaincodecor.com/categories/${categoryData.name}-${categoryData.id}`,
      },

      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (Math.random() * (4 - 4.9) + 4.9).toFixed(2),
        reviewCount: Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500,
      },
      hasVariant: variants,
      isRelatedTo: relatedProducts,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://jaincodecor.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryData.name,
            item: `https://jaincodecor.com/categories/${categoryData.name
              .replace(/\s+/g, "-")
              .toLowerCase()}-${categoryData.id}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: productData.name,
            item: `https://jaincodecor.com/products/${productData.name
              .replace(/\s+/g, "-")
              .toLowerCase()}-${productData.id}`,
          },
        ],
      },
    };
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData()) }}
      />
      <div className="p-4 w-full min-h-[90vh]">
        <h1 className="h1 mt-10 text-center text-xl font-lbold">
          {productData.name}
        </h1>
        {/* Column for Description */}
        <div className="flex items-center justify-center gap-4">
          <p className="text-lg leading-relaxed text-justify capitalize">
            {productDescription}
          </p>
          <p className="text-sm">
            {JSON.stringify(productData.variationTypes)}
          </p>
        </div>

        {/* Render Products */}
        <RelatedProducts
          categoryData={categoryData}
          currentProductId={productData.id}
        />
      </div>
    </>
  );
};

export default async function Page({
  params,
}: {
  params: { product_id: string };
}) {
  const prodIdString = params.product_id;
  const prodId = prodIdString.split("-").pop() || "";

  // Fetch categories directly in the component
  const { product } = await fetchProductData(prodId);
  console.log("product category: ", product?.category);
  const { categories } = await fetchCategories(product?.category);
  const category = categories[0];

  // Handle not found case
  if (!product) {
    // You can throw an error or return a not found component
    return notFound();
  }

  return <ProductPage productData={product} categoryData={category} />;
}
