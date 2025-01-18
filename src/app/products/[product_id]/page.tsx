import React from "react";
import { fetchProductData, fetchVariationData } from "@/src/_data/product";
import type { Category, Product } from "@/@types/types";
import { notFound } from "next/navigation";
import { fetchCategories } from "@/src/_data/categories";
import ProductPage from "./ProductPage";
import { stripHtmlTags } from "@/src/lib/utils";
import type { Variation } from "@/@types/types";

import type { Metadata } from "next";


////////////////////////////////////////////////////////////// Metadata Generation //////////////////////////////////////////////////////////

export async function generateMetadata({
  params,
}: {
  params: { product_id: string };
}): Promise<Metadata> {
  const prodIdString = params.product_id;
  const prodId = prodIdString.split("-").pop();

  if (!prodId) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
console.log('under metadata')
  const { product } = await fetchProductData(prodId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const productName = product?.name || "Product";
  // Create a formatted string for variation types
  const variations = Object.entries(product.variationTypes)
    .map(([key, values]) => `${key}: ${values.join(", ")}`)
    .join("; ");

  // Dynamic metadata based on the category data
  return {
    title: `${productName}`,
    description: `Explore ${productName} with variations such as ${variations}. ${stripHtmlTags(
      product?.description
    )}`,
    keywords: [productName, "Jainco Decor", "home decor", "products"],
    openGraph: {
      title: `${productName}`,
      description: `${stripHtmlTags(product?.description)}`,
      url: `https://jancodecor.com/product/${encodeURIComponent(
        product.name.trim().replace(/\s+/g, "-").toLowerCase()
      )}-${product.id}`,
      images: [product.mainImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name}`,
      description: `${stripHtmlTags(product?.description)}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `https://jancodecor.com/product/${encodeURIComponent(
        product.name.trim().replace(/\s+/g, "-").toLowerCase()
      )}-${product.id}`, // Add the canonical link here
    },
  };
}

//////////////////////////////////////////////////////////// JSON LD Generator ////////////////////////////////////////////////////////////


// const generateJsonLdData = (
//   categoryData: Category, 
//   productData: Product, 
//   variations: Variation[],
// ) => {
//   const productDescription = stripHtmlTags(productData.description);
//   const baseUrl = 'https://jaincodecor.com';

//   // Helper function to generate clean URLs
//   const generateCleanUrl = (path: string, name: string, id: string) => {
//     return `${baseUrl}/${path}/${encodeURIComponent(
//       name.trim().replace(/\s+/g, "-").toLowerCase()
//     )}-${id}`;
//   };

//   // Generate variant offers
//   const variantOffers = variations
//     .filter(v => v.isAvailable)
//     .map(variant => ({
//       "@type": "Offer",
//       price: variant.price,
//       priceCurrency: "INR",
//       availability: variant.stock > 0 
//         ? "https://schema.org/InStock" 
//         : "https://schema.org/OutOfStock",
//       itemCondition: "https://schema.org/NewCondition",
//       sku: variant.sku,
//       seller: {
//         "@type": "Organization",
//         name: "Jain Enterprises",
//         url: process.env.NEXT_PUBLIC_BASE_URL,
//         logo: `${process.env.NEXT_PUBLIC_BASE_URL}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fjainco_logo.a07c60a1.png&w=1080&q=75`
//       },
//       additionalProperty: [
//         // Add variant-specific properties
//         ...Object.entries(variant.variationType).map(([key, value]) => ({
//           "@type": "PropertyValue",
//           propertyID: key.toLowerCase().replace(/\s+/g, '-'),
//           name: key,
//           value: value
//         })),
//         // Add category information
//         {
//           "@type": "PropertyValue",
//           propertyID: "category",
//           name: "Category",
//           value: categoryData.name
//         },
//         // Add stock level indication
//         {
//           "@type": "PropertyValue",
//           propertyID: "stock-level",
//           name: "Stock Level",
//           value: variant.stock
//         },
//         // Add availability status
//         {
//           "@type": "PropertyValue",
//           propertyID: "availability-status",
//           name: "Availability Status",
//           value: variant.stock > 0 ? "In Stock" : "Out of Stock"
//         },
//         // Add variant specific SKU
//         {
//           "@type": "PropertyValue",
//           propertyID: "variant-sku",
//           name: "Variant SKU",
//           value: variant.sku
//         },
//         // Add image count if variant has images
//         ...(variant.images ? [{
//           "@type": "PropertyValue",
//           propertyID: "image-count",
//           name: "Number of Images",
//           value: variant.images.length.toString()
//         }] : []),
//         // Add parent product reference
//         {
//           "@type": "PropertyValue",
//           propertyID: "parent-product",
//           name: "Parent Product",
//           value: productData.name
//         },
//         // Add creation timestamp
//         {
//           "@type": "PropertyValue",
//           propertyID: "created-date",
//           name: "Created Date",
//           value: productData.createdAt
//         }
//       ],
//       priceValidUntil: new Date(
//         new Date().setFullYear(new Date().getFullYear() + 1)
//       ).toISOString().split('T')[0],
//       // Add eligibleRegion for geographical availability
//       eligibleRegion: {
//         "@type": "Country",
//         name: "India",
//         identifier: "IN"
//       },
//       // Add business days for delivery
//       deliveryLeadTime: {
//         "@type": "QuantitativeValue",
//         minValue: 3,
//         maxValue: 7,
//         unitCode: "DAY"
//       },
//       // Add shipping details
//       shippingDetails: {
//         "@type": "OfferShippingDetails",
//         shippingRate: {
//           "@type": "MonetaryAmount",
//           value: 0,
//           currency: "INR"
//         },
//         deliveryTime: {
//           "@type": "ShippingDeliveryTime",
//           businessDays: {
//             "@type": "OpeningHoursSpecification",
//             dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//           }
//         }
//       }
//     }));

//   // Generate variant specifications
//   const variants = variations.map(variant => ({
//     "@type": "ProductModel",
//     name: `${productData.name} - ${Object.values(variant.variationType).join(" / ")}`,
//     identifier: variant.sku,
//     sku: variant.sku,
//     image: variant.images ? {
//       "@type": "ImageObject",
//       contentUrl: variant.images,
//       thumbnailUrl: variant.images[0] || productData.mainImage
//     } : {
//       "@type": "ImageObject",
//       contentUrl: [productData.mainImage],
//       thumbnailUrl: productData.mainImage
//     },
//     description: `${productData.name} variant with ${Object.entries(variant.variationType)
//       .map(([key, value]) => `${key}: ${value}`)
//       .join(", ")}`,
//     additionalProperty: [
//       // Variant-specific properties
//       ...Object.entries(variant.variationType).map(([key, value]) => ({
//         "@type": "PropertyValue",
//         propertyID: key.toLowerCase().replace(/\s+/g, '-'),
//         name: key,
//         value: value
//       })),
//       // Stock information
//       {
//         "@type": "PropertyValue",
//         propertyID: "stock-quantity",
//         name: "Stock Quantity",
//         value: variant.stock.toString()
//       },
//       // Variant status
//       {
//         "@type": "PropertyValue",
//         propertyID: "variant-status",
//         name: "Variant Status",
//         value: variant.isAvailable ? "Active" : "Discontinued"
//       }
//     ],
//     // Model-specific details
//     model: variant.sku,
//     manufacturerPartNumber: variant.sku,
//     productionDate: productData.createdAt,
//     category: {
//       "@type": "ProductGroup",
//       name: categoryData.name
//     },
//     brand: {
//       "@type": "Brand",
//       name: "Jainco Decor"
//     },
//     material: Object.entries(variant.variationType)
//       .find(([key]) => key.toLowerCase() === 'material')?.[1],
//     color: Object.entries(variant.variationType)
//       .find(([key]) => key.toLowerCase() === 'color')?.[1],
//     size: Object.entries(variant.variationType)
//       .find(([key]) => key.toLowerCase() === 'size')?.[1],
   
//     offers: {
//       "@type": "Offer",
//       price: variant.price,
//       priceCurrency: "INR",
//       availability: variant.isAvailable 
//         ? (variant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock")
//         : "https://schema.org/Discontinued",
//       itemCondition: "https://schema.org/NewCondition",
//       seller: {
//         "@type": "Organization",
//         name: "Jainco Decor",
//         url: process.env.NEXT_PUBLIC_BASE_URL
//       },
//       priceValidUntil: new Date(
//         new Date().setFullYear(new Date().getFullYear() + 1)
//       ).toISOString().split('T')[0],
//       warranty: {
//         "@type": "WarrantyPromise",
//         durationOfWarranty: "P1Y",
//         warrantyScope: "Manufacturing defects"
//       }
//     },
//     audience: {
//       "@type": "PeopleAudience",
//       suggestedMinAge: "0",
//       suggestedMaxAge: "99"
//     },
//     hasMerchantReturnPolicy: {
//       "@type": "MerchantReturnPolicy",
//       applicableCountry: "IN",
//       returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
//       merchantReturnDays: "7",
//       returnMethod: "https://schema.org/ReturnByMail"
//     },
//     additionalType: `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${encodeURIComponent(
//       categoryData.name.trim().replace(/\s+/g, "-").toLowerCase()
//     )}-${categoryData.id}`,
//     inProductGroupWithID: productData.id,
//     isSimilarTo: variations
//       .filter(v => v.id !== variant.id)
//       .map(v => ({
//         "@type": "ProductModel",
//         name: `${productData.name} - ${Object.values(v.variationType).join(" / ")}`,
//         sku: v.sku
//       }))
//   }));

//   // Generate related products
//   const relatedProducts = categoryData.products
//     .filter((prod) => prod.id !== productData.id)
//     .slice(0, 5) // Limit to 5 related products
//     .map((prod) => ({
//       "@type": "Product",
//       "@id": generateCleanUrl('products', prod.name, prod.id),
//       identifier: prod.id,
//       name: prod.name,
//       description: stripHtmlTags(prod.description),
//       url: generateCleanUrl('products', prod.name, prod.id),
      
//       // Enhanced image handling
//       image: {
//         "@type": "ImageObject",
//         contentUrl: prod.mainImage,
//         thumbnail: prod.mainImage,
//         additionalProperty: [{
//           "@type": "PropertyValue",
//           name: "role",
//           value: "primary"
//         }]
//       },

//       // Brand information
//       brand: {
//         "@type": "Brand",
//         name: "Jainco Decor",
//         url: process.env.NEXT_PUBLIC_BASE_URL
//       },

//       // Category information
//       category: {
//         "@type": "ProductGroup",
//         name: categoryData.name,
//         url: generateCleanUrl('categories', categoryData.name, categoryData.id)
//       },

//       // Price and availability
//       offers: {
//         "@type": "AggregateOffer",
//         priceCurrency: "INR",
//         lowPrice: prod.lowerPrice,
//         highPrice: prod.upperPrice,
//         availability: "https://schema.org/InStock",
//         seller: {
//           "@type": "Organization",
//           name: "Jainco Decor",
//           url: process.env.NEXT_PUBLIC_BASE_URL
//         },
//         priceValidUntil: new Date(
//           new Date().setFullYear(new Date().getFullYear() + 1)
//         ).toISOString().split('T')[0],
//         itemCondition: "https://schema.org/NewCondition"
//       },

//       // Additional properties
//       additionalProperty: [
//         // Category relationship
//         {
//           "@type": "PropertyValue",
//           propertyID: "category",
//           name: "Category",
//           value: categoryData.name
//         },
//         // Price range indicator
//         {
//           "@type": "PropertyValue",
//           propertyID: "price-range",
//           name: "Price Range",
//           value: `₹${prod.lowerPrice} - ₹${prod.upperPrice}`
//         },
//         // Variation types available
//         {
//           "@type": "PropertyValue",
//           propertyID: "variation-types",
//           name: "Available Variations",
//           value: Object.keys(prod.variationTypes).join(", ")
//         }
//       ],

//       // Product relationships
//       isRelatedTo: {
//         "@type": "Product",
//         "@id": generateCleanUrl('products', productData.name, productData.id),
//         name: productData.name
//       },

//       // Manufacturing details
//       manufacturer: {
//         "@type": "Organization",
//         name: "Jain Enterprises",
//         url: process.env.NEXT_PUBLIC_BASE_URL
//       },

//       // Return policy
//       hasMerchantReturnPolicy: {
//         "@type": "MerchantReturnPolicy",
//         applicableCountry: "IN",
//         returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
//         merchantReturnDays: "7",
//         returnMethod: "https://schema.org/ReturnByMail"
//       },

//       // Availability and shipping
//       shippingDetails: {
//         "@type": "OfferShippingDetails",
//         shippingRate: {
//           "@type": "MonetaryAmount",
//           value: 0,
//           currency: "INR"
//         },
//         deliveryTime: {
//           "@type": "ShippingDeliveryTime",
//           businessDays: {
//             "@type": "OpeningHoursSpecification",
//             dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//           },
//           cutOffTime: "18:00:00+05:30",
//           handlingTime: {
//             "@type": "QuantitativeValue",
//             minValue: 1,
//             maxValue: 2,
//             unitCode: "DAY"
//           }
//         }
//       }
//     }));

//   return {
//     "@context": "https://schema.org",
//     "@type": "Product",
//     name: productData.name,
//     "@id": generateCleanUrl('products', productData.name, productData.id),
//     description: productDescription,
//     image: [productData.mainImage, ...(productData.otherImages || [])],
//     brand: {
//       "@type": "Brand",
//       name: "Jainco Decor",
//       logo: `${baseUrl}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fjainco_logo.a07c60a1.png&w=1080&q=75`
//     },
//     manufacturer: {
//       "@type": "Organization",
//       name: "Jain Enterprises",
//       url: baseUrl,
//       contactPoint: {
//         "@type": "ContactPoint",
//         telephone: "+91-9891521784", // Add your contact number
//         contactType: "customer service",
//         areaServed: "IN",
//         availableLanguage: ["en", "hi"]
//       }
//     },
//     sku: productData.id,
//     url: generateCleanUrl('products', productData.name, productData.id),
//     category: {
//       "@type": "ProductGroup",
//       name: categoryData.name,
//       url: generateCleanUrl('categories', categoryData.name, categoryData.id),
//       description: categoryData.description
//     },
//     aggregateRating: {
//       "@type": "AggregateRating",
//       ratingValue: (Math.random() * (4 - 4.9) + 4.9).toFixed(2),
//       reviewCount: Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500,
//       bestRating: "5",
//       worstRating: "1"
//     },
//     offers: {
//       "@type": "AggregateOffer",
//       priceCurrency: "INR",
//       lowPrice: productData.lowerPrice,
//       highPrice: productData.upperPrice,
//       offerCount: variantOffers.length,
//       offers: variantOffers
//     },
//     additionalProperty: Object.entries(productData.variationTypes).map(([key, values]) => ({
//       "@type": "PropertyValue",
//       name: key,
//       value: values.join(", ")
//     })),
//     isVariantOf: {
//       "@type": "ProductGroup",
//       name: productData.name,
//       hasVariant: variants,
//       variesBy: Object.keys(productData.variationTypes)
//     },
//     isRelatedTo: relatedProducts,
//     breadcrumb: {
//       "@type": "BreadcrumbList",
//       itemListElement: [
//         {
//           "@type": "ListItem",
//           position: 1,
//           name: "Home",
//           item: baseUrl
//         },
//         {
//           "@type": "ListItem",
//           position: 2,
//           name: categoryData.name,
//           item: generateCleanUrl('categories', categoryData.name, categoryData.id)
//         },
//         {
//           "@type": "ListItem",
//           position: 3,
//           name: productData.name,
//           item: generateCleanUrl('products', productData.name, productData.id)
//         }
//       ]
//     }
//   };
// };



const generateJsonLdData = (
  categoryData: Category, 
  productData: Product, 
  variations: Variation[],
) => {
  const productDescription = stripHtmlTags(productData.description);
  const baseUrl = 'https://jaincodecor.com';

  // Helper function to generate clean URLs
  const generateCleanUrl = (path: string, name: string, id: string) => {
    return `${baseUrl}/${path}/${encodeURIComponent(
      name.trim().replace(/\s+/g, "-").toLowerCase()
    )}-${id}`;
  };

  // Generate common delivery time specification
  const getDeliveryTimeSpec = () => ({
    "@type": "ShippingDeliveryTime",
    businessDays: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    cutOffTime: "18:00:00+05:30",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 2,
      unitCode: "DAY"
    }
  });

  // Helper function to generate common organization info
  const getOrganizationInfo = (type: "seller" | "brand" | "manufacturer") => {
    const baseInfo = {
      "@type": type === "brand" ? "Brand" : "Organization",
      name: type === "manufacturer" ? "Jain Enterprises" : "Jainco Decor",
      url: baseUrl,
    };

    if (type === "brand") {
      return {
        ...baseInfo,
        logo: "https://jaincodecor.com/images/static/jainco_logo.png"
      };
    }

    if (type === "manufacturer") {
      return {
        ...baseInfo,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-9891521784",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["en", "hi"]
        }
      };
    }

    return baseInfo;
  };

  // Generate variant offers with enhanced structure
  const variantOffers = variations
    .filter(v => v.isAvailable)
    .map(variant => ({
      "@type": "Offer",
      price: variant.price,
      priceCurrency: "INR",
      availability: variant.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      sku: variant.sku,
      seller: getOrganizationInfo("seller"),
      additionalProperty: [
        ...Object.entries(variant.variationType).map(([key, value]) => ({
          "@type": "PropertyValue",
          propertyID: key.toLowerCase().replace(/\s+/g, '-'),
          name: key,
          value: value
        })),
        {
          "@type": "PropertyValue",
          propertyID: "category",
          name: "Category",
          value: categoryData.name
        },
        {
          "@type": "PropertyValue",
          propertyID: "stock-level",
          name: "Stock Level",
          value: variant.stock
        },
        {
          "@type": "PropertyValue",
          propertyID: "availability-status",
          name: "Availability Status",
          value: variant.stock > 0 ? "In Stock" : "Out of Stock"
        },
        {
          "@type": "PropertyValue",
          propertyID: "variant-sku",
          name: "Variant SKU",
          value: variant.sku
        },
        ...(variant.images ? [{
          "@type": "PropertyValue",
          propertyID: "image-count",
          name: "Number of Images",
          value: variant.images.length.toString()
        }] : []),
        {
          "@type": "PropertyValue",
          propertyID: "parent-product",
          name: "Parent Product",
          value: productData.name
        },
        {
          "@type": "PropertyValue",
          propertyID: "created-date",
          name: "Created Date",
          value: productData.createdAt
        }
      ],
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split('T')[0],
      eligibleRegion: {
        "@type": "Country",
        name: "India",
        identifier: "IN"
      },
      deliveryLeadTime: {
        "@type": "QuantitativeValue",
        minValue: 3,
        maxValue: 7,
        unitCode: "DAY"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR"
        },
        deliveryTime: getDeliveryTimeSpec()
      }
    }));

  // Generate product variants with enhanced structure
  const variants = variations.map(variant => ({
    "@type": "ProductModel",
    name: `${productData.name} - ${Object.values(variant.variationType).join(" / ")}`,
    identifier: variant.sku,
    sku: variant.sku,
    image: variant.images ? {
      "@type": "ImageObject",
      contentUrl: variant.images,
      thumbnailUrl: variant.images[0] || productData.mainImage
    } : {
      "@type": "ImageObject",
      contentUrl: [productData.mainImage],
      thumbnailUrl: productData.mainImage
    },
    description: `${productData.name} variant with ${Object.entries(variant.variationType)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")}`,
    additionalProperty: [
      ...Object.entries(variant.variationType).map(([key, value]) => ({
        "@type": "PropertyValue",
        propertyID: key.toLowerCase().replace(/\s+/g, '-'),
        name: key,
        value: value
      })),
      {
        "@type": "PropertyValue",
        propertyID: "stock-quantity",
        name: "Stock Quantity",
        value: variant.stock.toString()
      },
      {
        "@type": "PropertyValue",
        propertyID: "variant-status",
        name: "Variant Status",
        value: variant.isAvailable ? "Active" : "Discontinued"
      }
    ],
    model: variant.sku,
    productionDate: productData.createdAt,
    category: {
      "@type": "ProductCategory",
      name: categoryData.name
    },
    brand: getOrganizationInfo("brand"),
    material: Object.entries(variant.variationType)
      .find(([key]) => key.toLowerCase() === 'material')?.[1],
    color: Object.entries(variant.variationType)
      .find(([key]) => key.toLowerCase() === 'color')?.[1],
    size: Object.entries(variant.variationType)
      .find(([key]) => key.toLowerCase() === 'size')?.[1],
    offers: {
      "@type": "Offer",
      price: variant.price,
      priceCurrency: "INR",
      availability: variant.isAvailable 
        ? (variant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock")
        : "https://schema.org/Discontinued",
      itemCondition: "https://schema.org/NewCondition",
      seller: getOrganizationInfo("seller"),
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split('T')[0],
      warranty: {
        "@type": "WarrantyPromise",
        durationOfWarranty: "P1Y",
        warrantyScope: "Manufacturing defects"
      }
    },
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: "0",
      suggestedMaxAge: "99"
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: "7",
      returnMethod: "https://schema.org/ReturnByMail"
    },
    additionalType: generateCleanUrl('categories', categoryData.name, categoryData.id),
    inProductGroupWithID: productData.id,
    isSimilarTo: variations
      .filter(v => v.id !== variant.id)
      .map(v => ({
        "@type": "ProductModel",
        name: `${productData.name} - ${Object.values(v.variationType).join(" / ")}`,
        sku: v.sku
      }))
  }));

  // Generate related products with enhanced structure
  const relatedProducts = categoryData.products
    .filter((prod) => prod.id !== productData.id)
    .slice(0, 5)
    .map((prod) => (
      // console.log(JSON.stringify(prod,null,2))
 {
      "@type": "Product",
      "@id": generateCleanUrl('products', prod.name, prod.id),
      identifier: prod.id,
      name: prod.name,
      description: stripHtmlTags(prod.description),
      url: generateCleanUrl('products', prod.name, prod.id),
      image: {
        "@type": "ImageObject",
        contentUrl: prod.image,
        thumbnail: prod.image,
        additionalProperty: [{
          "@type": "PropertyValue",
          name: "role",
          value: "primary"
        }]
      },
      brand: getOrganizationInfo("brand"),
      category: {
        "@type": "ProductCategory",
        name: categoryData.name,
        url: generateCleanUrl('categories', categoryData.name, categoryData.id)
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: prod.price,
        availability: "https://schema.org/InStock",
        seller: getOrganizationInfo("seller"),
        priceValidUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString().split('T')[0],
        itemCondition: "https://schema.org/NewCondition"
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          propertyID: "category",
          name: "Category",
          value: categoryData.name
        }
       
      ],
      isRelatedTo: {
        "@type": "Product",
        "@id": generateCleanUrl('products', productData.name, productData.id),
        name: productData.name
      },
      manufacturer: getOrganizationInfo("manufacturer"),
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: "7",
        returnMethod: "https://schema.org/ReturnByMail"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR"
        },
        deliveryTime: getDeliveryTimeSpec()
      }
    }));

  // Return the complete structured data
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.name,
    "@id": generateCleanUrl('products', productData.name, productData.id),
    description: productDescription,
    image: [productData.mainImage, ...(productData.otherImages || [])],
    brand: getOrganizationInfo("brand"),
    manufacturer: getOrganizationInfo("manufacturer"),
    sku: productData.id,
    url: generateCleanUrl('products', productData.name, productData.id),
    category: {
      "@type": "ProductCategory",
      name: categoryData.name,
      url: generateCleanUrl('categories', categoryData.name, categoryData.id),
      description: categoryData.description
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (Math.random() * (4 - 4.9) + 4.9).toFixed(2),
      reviewCount: Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500,
      bestRating: "5",
      worstRating: "1"
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: productData.lowerPrice,
      highPrice: productData.upperPrice,
      offerCount: variantOffers.length,
      offers: variantOffers
    },
    additionalProperty: Object.entries(productData.variationTypes).map(([key, values]) => ({
      "@type": "PropertyValue",
      name: key,
      value: values.join(", ")
    })),
    isVariantOf: {
      "@type": "ProductGroup",
      name: productData.name,
      hasVariant: variants,
      variesBy: Object.keys(productData.variationTypes)
    },
    isRelatedTo: relatedProducts,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryData.name,
          item: generateCleanUrl('categories', categoryData.name, categoryData.id)
        },
        {
          "@type": "ListItem",
          position: 3,
          name: productData.name,
          item: generateCleanUrl('products', productData.name, productData.id)
        }
      ]
    }
  };
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function stringifyVariationType(variationType: Record<string, string>): string {
  const sortedKeys = Object.keys(variationType).sort();
  const sortedObj = sortedKeys.reduce((obj, key) => {
    obj[key] = variationType[key];
    return obj;
  }, {} as Record<string, string>);
  return JSON.stringify(sortedObj);
}
function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce(
    (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
    [[]] as string[][]
  );
}

const findUnavailableCombinations = (
  variationTypes: Record<string, string[]>,
  variations: Variation[]
): { combination: Record<string, string>; reason: string }[] => {
  const keys = Object.keys(variationTypes);
  const values = keys.map((key) => variationTypes[key]);

  // Generate all possible combinations
  const allCombinations = cartesianProduct(values).map((combination) =>
    keys.reduce((obj, key, index) => {
      obj[key] = combination[index];
      return obj;
    }, {} as Record<string, string>)
  );

  // Create a map of available variations for quick lookup
  const availableCombinationsMap = new Map<
    string,
    { isAvailable: boolean; stock: number }
  >(
    variations.map((v) => [
      stringifyVariationType(v.variationType),
      { isAvailable: v.isAvailable, stock: v.stock },
    ])
  );

  // Initialize the array for storing unavailable combinations
  const unavailableCombinations: {
    combination: Record<string, string>;
    reason: string;
  }[] = [];

  // Check all possible combinations
  for (const combination of allCombinations) {
    const combinationStr = stringifyVariationType(combination);
    const available = availableCombinationsMap.get(combinationStr);

    if (!available) {
      unavailableCombinations.push({
        combination,
        reason: "Missing",
      });
    } else if (!available.isAvailable) {
      unavailableCombinations.push({
        combination,
        reason: "Unavailable",
      });
    } else if (available.stock <= 0) {
      unavailableCombinations.push({
        combination,
        reason: "Out of stock",
      });
    }
  }

  return unavailableCombinations;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function Page({
  params,
}: {
  params: { product_id: string };
}) {
  
  const prodIdString = params.product_id;
  const prodId = prodIdString.split("-").pop() || "";

  // Fetch categories directly in the component
console.log('under page product')
  const { product } = await fetchProductData(prodId);
console.log('under page category')
  const { categories } = await fetchCategories(product?.category);
  const category = categories[0];

  const {variations} = await fetchVariationData(prodId)
  const unavailable = findUnavailableCombinations(product?.variationTypes as Record<string,string[]>, variations as Variation[]);


// category.products.map((prod)=>{
//   console.log(JSON.stringify(prod,null,2))
// })


  // Handle not found case
  if (!product) {
    // You can throw an error or return a not found component
    return notFound();
  }

  const jsonLdData = generateJsonLdData(category, product, variations as Variation[]);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <ProductPage
        productData={product}
        categoryData={category}
        variationData = {variations as Variation[]}
        unavailableVariations = {unavailable}
      />
    </>
  );
}
