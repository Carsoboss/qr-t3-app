import React, { useState } from "react";
import Image from "next/image";
import { LoadingPage } from "@qrfound/components/navigation/loading";
import { useUser } from "@clerk/nextjs";
import { api } from "@qrfound/utils/api";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import toast from "react-hot-toast";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MyStickers() {
  const { user, isLoaded } = useUser();
  const { data, isLoading: stickersLoading } =
    api.sticker.getStickersByUser.useQuery();
  const removeUserFromStickerMutation =
    api.sticker.removeUserFromSticker.useMutation();

  const [open, setOpen] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null
  );
  const ctx = api.useContext();
  const handleOpenRemoveStickerModal = (stickerId: string) => {
    setSelectedStickerId(stickerId);
    setOpen(true);
  };

  const handleConfirmRemoveSticker = async () => {
    if (selectedStickerId) {
      await removeUserFromStickerMutation
        .mutateAsync({
          stickerId: selectedStickerId,
        })
        .then(() => {
          toast.success("Sticker removed successfully");
          setOpen(false);
          void ctx.sticker.getStickersByUser.invalidate();
        })
        .catch((error) => {
          console.error("Error removing sticker:", error);
          toast.error("Failed to remove sticker");
        });
    }
  };

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (stickersLoading) {
    return <LoadingPage />;
  }

  if (!data) return <div>Something went wrong</div>;

  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/[^\d+]/g, "");

    const hasCountryCode = cleaned.startsWith("+");
    const countryCode = hasCountryCode
      ? cleaned.substring(0, cleaned.indexOf("1") + 1)
      : "";
    const nationalNumber = hasCountryCode
      ? cleaned.substring(cleaned.indexOf("1") + 1)
      : cleaned;
    if (nationalNumber.length === 10) {
      const areaCode = nationalNumber.substring(0, 3);
      const middleThree = nationalNumber.substring(3, 6);
      const lastFour = nationalNumber.substring(6);
      const formattedNationalNumber = `(${areaCode}) ${middleThree}-${lastFour}`;

      return hasCountryCode
        ? `${countryCode} ${formattedNationalNumber}`
        : formattedNationalNumber;
    } else {
      return phoneNumber;
    }
  };

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-2xl pb-24 pt-8 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8">
        <section aria-labelledby="products-heading" className="mt-6">
          <h2 id="products-heading" className="sr-only">
            My Stickers
          </h2>

          {data.length <= 0 && <div>You don&apos;t have any stickers</div>}

          <div className="space-y-8">
            {data.map((sticker) => {
              const deviceName = sticker.deviceType;
              const lowercase = deviceName.toLowerCase();
              const formattedDeviceName =
                lowercase.charAt(0).toUpperCase() + lowercase.slice(1);

              const userPhoneNumber = user?.primaryPhoneNumber?.toString();
              const formattedPhoneNumber = userPhoneNumber
                ? formatPhoneNumber(userPhoneNumber)
                : "";

              return (
                <div
                  key={`${sticker.id}-sticker`}
                  className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >
                  <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                    <div className="sm:flex lg:col-span-7">
                      <div className="aspect-w-1 aspect-h-1 sm:aspect-none w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40">
                        <a href={`sticker/${sticker.id}`}>
                          <Image
                            width={605}
                            height={500}
                            src={sticker.stickerType.url}
                            alt={sticker.stickerType.name}
                          />
                        </a>
                      </div>

                      <div className="mt-6 w-full sm:ml-6 sm:mt-0">
                        <div className="flex w-full items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900">
                            <div>{formattedDeviceName}</div>
                          </h3>
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <div>
                              <Menu.Button className=" flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                <span className="sr-only">Open options</span>
                                <EllipsisVerticalIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-red-400",
                                          "block px-4 py-2 text-sm"
                                        )}
                                        onClick={() =>
                                          handleOpenRemoveStickerModal(
                                            sticker.id
                                          )
                                        }
                                      >
                                        Remove sticker
                                      </a>
                                    )}
                                  </Menu.Item>
                                  {/* <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}
                                      >
                                        Edit sticker
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}
                                      >
                                        Change contact info
                                      </a>
                                    )}
                                  </Menu.Item> */}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {sticker.stickerType.name}
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 text-sm font-medium" />
                        <a>
                          <p className="mt-2 text-sm text-gray-500">
                            {user?.primaryEmailAddress?.toString()}
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            {formattedPhoneNumber}
                          </p>
                        </a>
                      </div>
                    </div>
                    <div className="mt-6 lg:col-span-5 lg:mt-0 lg:pr-8">
                      {/* Description and details */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Confirmation Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Remove Sticker
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to remove this sticker? This
                          action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={handleConfirmRemoveSticker}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
