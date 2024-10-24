import { Product } from "@/@types/types";
import Image from "next/image";
import { stripHtmlTags } from "@/src/lib/utils";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

interface ProductGridProps {
  products: Product[];
  heading: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, heading }) => {
  return (
    <div className="bg-primary py-16 px-4 border-t-4 border-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 capitalize">
          {heading}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg p-8 px-4 md:px-8 border-secondary border"
            >
              <div className="relative overflow-hidden w-full aspect-square rounded-lg">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link
                    href={`/products/${encodeURIComponent(
                      product.name.trim().replace(/\s+/g, "-").toLowerCase()
                    )}-${product.id}`}
                  >
                    <button className="bg-white text-primary py-2 px-6 rounded-full font-bold hover:text-primary-100">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
              <Link
                    href={`/products/${encodeURIComponent(
                      product.name.trim().replace(/\s+/g, "-").toLowerCase()
                    )}-${product.id}`}
                  >
              <h3 className="text-xl font-bold text-gray-900 mt-4 capitalize">
                {product.name}
              </h3></Link>
              <p className="text-primary-100 text-sm mt-2 font-iregular">
                {stripHtmlTags(product.description)}
              </p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col justify-start items-start">
                  <span className="text-[#10B981] font-bold md:text-lg text-base">
                    ₹{product.lowerPrice.toFixed(2)} - ₹
                    {product.upperPrice.toFixed(2)}
                  </span>
                  <span className="md:text-xs text-[0.5rem] text-white bg-gray-500 rounded-lg p-1">
                    Wholesale Prices
                  </span>
                </div>
                {/* Do not change indent of next 14 lines*/}
                
                <a
                  href={`https://wa.me/919891521784?text=
                    ${encodeURIComponent(
                      `Hello Jainco Decor!
                      
I am interested in buying:
                       
*Product*: _${product.name}_
*Image*: ${product.mainImage}
                       
Looking forward to your response!`
                    )}`}
                  target="_blank"
                >
                  <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-transparent hover:border hover:border-gray-900 hover:text-primary text-sm md:text-base flex items-center justify-center gap-2">
                    <FaWhatsapp /> Enquire Now
                  </button>
                </a>
              

               
              </div>

              <div className="flex flex-col items-start justify-start mt-3 gap-3">
                {Object.entries(product.variationTypes).map(
                  ([key, value], idx) => (
                    <div key={idx}>
                      {key!=="" && (
                        <span className="text-base font-bold capitalize">
                        {key}:&nbsp;&nbsp;
                       </span>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {value.map((item, i) => (
                          <span
                            key={i}
                            className="whitespace-pre-line capitalize text-sm font-rregular"
                          >
                            {item}
                            {i !== value.length - 1 && <span>,</span>}&nbsp;
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
