import React from "react";
import { api } from "@qrfound/utils/api";
import Image from "next/image";
import { LoadingPage } from "@qrfound/components/navigation/loading";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function MyStickers() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

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
  console.log(data?.length);
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-2xl pb-24 pt-8 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex w-full items-center justify-between sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              My Stickers
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4 px-5 py-3">
          {/* <a
            href="http://shop.qrfound.cool"
            className="rounded-md bg-violet-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Buy a sticker
          </a> */}
          <a
            href=""
            className="rounded-md bg-violet-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Scan a sticker
          </a>
        </div>

        {/* Items */}
        <section aria-labelledby="products-heading" className="mt-6">
          <h2 id="products-heading" className="sr-only">
            My Stickers
          </h2>

          {data.length <= 0 && <div>You don&apos;t have any stickers</div>}

          <div className="space-y-8">
            {data.map((data) => {
              const deviceName = data.deviceType;
              const lowercase = deviceName.toLowerCase();
              const formattedDeviceName =
                lowercase.charAt(0).toUpperCase() + lowercase.slice(1);

              return (
                <>
                  <div
                    key={`${data.id}-sticker`}
                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                  >
                    <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                      <div className="sm:flex lg:col-span-7">
                        <div className="aspect-w-1 aspect-h-1 sm:aspect-none w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40">
                          <div className="h-full w-full object-cover object-center sm:h-full sm:w-full">
                            <Link href={`sticker/${data.id}`}>
                              <Image
                                width={605}
                                height={500}
                                src={data.stickerType.url}
                                alt={data.stickerType.name}
                              />
                            </Link>
                          </div>
                        </div>

                        <div className="mt-6 w-full sm:ml-6 sm:mt-0">
                          <div className="flex w-full items-center justify-between">
                            <h3 className="text-base font-medium text-gray-900">
                              <div>{formattedDeviceName}</div>
                            </h3>
                            <a
                              href={`update-item`}
                              className="text-sm font-medium text-violet-500 hover:text-violet-600 sm:block"
                            >
                              edit
                            </a>
                          </div>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {data.stickerType.name}
                          </p>
                          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 text-sm font-medium" />
                          <Link href="edit-contact">
                            <p className="mt-2 text-sm text-gray-500">
                              {user?.primaryEmailAddress?.toString()}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                              {user?.primaryPhoneNumber?.toString()}
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
