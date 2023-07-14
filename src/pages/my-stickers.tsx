import React, { useState } from "react";
import QrReader from "react-qr-reader";


const products = [
  {
    id: 1,
    name: "Sticker Name",
    type: "Laptop",
    email: "f•••@example.com",
    phone: "1•••••••••40",
    status: "Preparing to ship",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-01.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
  {
    id: 2,
    name: "Sticker Name",
    type: "Laptop",
    email: "f•••@example.com",
    phone: "1•••••••••40",
    status: "Preparing to ship",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-01.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
  // More products...
];

export default function MyStickers() {
  // add a message saying sticker added above the confirmation component. Users can now contact you by scanning your sticker. Put your sticker on your <device type> and scan it so others can contact you.

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-2xl pt-8 pb-24 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex w-full items-center justify-between sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              My Stickers
            </h1>
          </div>
        </div>

        {/* Items */}
        <section aria-labelledby="products-heading" className="mt-6">
          <h2 id="products-heading" className="sr-only">
            Products purchased
          </h2>

          <div className="space-y-8">
            {products.map((product) => (
              <>
                <div
                  key={product.id}
                  className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >
                  <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                    <div className="sm:flex lg:col-span-7">
                      <div className="aspect-w-1 aspect-h-1 sm:aspect-none w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                        />
                      </div>

                      <div className="mt-6 w-full sm:mt-0 sm:ml-6">
                        <div className="flex w-full items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900">
                            <div>{product.type}</div>
                          </h3>
                          <a
                            href="#"
                            className="text-sm font-medium text-indigo-500 hover:text-indigo-600 sm:block"
                          >
                            edit
                          </a>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 text-sm font-medium" />
                        <p className="mt-2 text-sm text-gray-500">
                          {product.email}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {product.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
               <div className="flex items-center justify-center">
                 <a href="lost-item" className="rounded-md bg-violet-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Lost Item Page
                </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
