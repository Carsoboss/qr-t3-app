import React from "react";
import { api } from "@qrfound/utils/api";
import Image from "next/image";
import { Clerk } from "@clerk/nextjs/dist/types/server";
import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "@qrfound/components/navigation/loading";
import { Prisma } from "@prisma/client";

export default function MyStickers() {
  // add a message saying sticker added above the confirmation component. Users can now contact you by scanning your sticker. Put your sticker on your <device type> and scan it so others can contact you.

  const { data, isLoading: stickersLoading } =
    api.sticker.getStickersByUser.useQuery();

  if (stickersLoading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }
  if (!data) return <div>Something went wrong</div>;

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

          {data.length <= 0 && <div>You don&apos;t have any stickers</div>}

          <div className="space-y-8">
            {data.map((data) => {
              const deviceName = data.sticker.deviceType;
              const lowercase = deviceName.toLowerCase();
              const formattedDeviceName =
                lowercase.charAt(0).toUpperCase() + lowercase.slice(1);

              return (
                <>
                  <div
                    key={`${data.sticker.id}-sticker`}
                    className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                  >
                    <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                      <div className="sm:flex lg:col-span-7">
                        <div className="aspect-w-1 aspect-h-1 sm:aspect-none w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40">
                          <div className="h-full w-full object-cover object-center sm:h-full sm:w-full">
                            {/* Todo: add this back in when you have an img url for stickers */}
                            {/* <Image
                            width={605}
                            height={500}
                            src={data.imageSrc}
                            alt={data.imageAlt}
                          /> */}
                          </div>
                        </div>

                        <div className="mt-6 w-full sm:mt-0 sm:ml-6">
                          <div className="flex w-full items-center justify-between">
                            <h3 className="text-base font-medium text-gray-900">
                              <div>{formattedDeviceName}</div>
                            </h3>
                            <a
                              href="update-item"
                              className="text-sm font-medium text-violet-500 hover:text-violet-600 sm:block"
                            >
                              edit item
                            </a>
                          </div>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {data.sticker.stickerType.name}
                          </p>
                          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 text-sm font-medium" />
                          <p className="mt-2 text-sm text-gray-500">
                            {data.sticker.ownerContactInfo.email}
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            {data.sticker.ownerContactInfo.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            <div className="flex items-center justify-center">
              <a
                href="lost-item"
                className="rounded-md bg-violet-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                View My Lost Item Page
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
