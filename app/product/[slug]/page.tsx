"use server";

import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

import { getBase64 } from "@/lib/image";
import { Product } from "@/lib/interface";

import ProductInformation from "@/components/product-information";

interface Props {
  params: {
    slug: string;
  };
}

async function getProduct({ params }: Props) {
  const query = `*[_type == "product" && slug.current == "${params.slug}"][0]{
    "id": _id,
    "slug": slug.current,
    name,
    author, 
    price, 
    "image": image.asset._ref,
    body
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function ProductPage({ params }: Props) {
  const product: Product = await getProduct({ params });

  const myBlurDataUrl = await getBase64(urlForImage(product.image));

  return (
    <div className="mx-auto max-w-5xl sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="pb-20 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 grid-rows-subgrid">
          {/* PRODUCT IMAGE */}
          <div className="aspect-h-1 aspect-w-1 w-full grid place-items-center">
            <Image
              src={urlForImage(product.image)}
              alt={product.name}
              width={400}
              height={600}
              placeholder="blur"
              blurDataURL={myBlurDataUrl}
              priority
              className="h-full border-2 border-gray-200 object-cover object-center shadow-sm sm:rounded-lg"
            />
          </div>

          {/* PRODUCT CARD */}
          <ProductInformation product={product} />
        </div>
      </div>
    </div>
  );
}
