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

  const [removingStickerId, setRemovingStickerId] = useState<string | null>(
    null
  );

  const handleConfirmRemoveSticker = () => {
    if (selectedStickerId && removingStickerId === null) {
      setOpen(false);
      setRemovingStickerId(selectedStickerId);
    }
  };

  const onTransitionEnd = async (
    event: React.TransitionEvent,
    stickerId: string
  ) => {
    if (event.propertyName === "opacity" && stickerId === removingStickerId) {
      try {
        await removeUserFromStickerMutation.mutateAsync({ stickerId });
        toast.success("Sticker removed successfully");
      } catch (error) {
        console.error("Error removing sticker:", error);
        toast.error("Failed to remove sticker");
      } finally {
        setRemovingStickerId(null); // Reset removing state
        void ctx.sticker.getStickersByUser.invalidate(); // Refresh the list
      }
    }
  };

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (stickersLoading) {
    return <LoadingPage />;
  }
  if ((data ?? []).length <= 0) {
    return (
      <div className="flex flex-col items-center justify-start px-4 pb-40 pt-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Rocket icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="mx-auto h-16 w-16 text-purple-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>

          <h2 className="mt-4 pt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            You Don&apos;t Have Any Stickers
          </h2>

          <p className="pt-6 text-center text-gray-600">
            Scan your existing sticker to set it up <br className="sm:hidden" />
            or buy a new sticker to get started.
          </p>

          <div className="mt-8 flex w-full justify-center">
            <a href="https://shop.qrfound.cool">
              <button className="rounded-md bg-violet-500 px-4 py-2 shadow-sm hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
                {/* Sparkles icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 inline h-6 w-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>
                <span className="pt-4 font-semibold text-white">
                  Buy a Sticker Now
                </span>
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  } else if (!data) return <div>Something went wrong</div>;
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

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
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between space-x-4">
          <h2 className="text-lg font-medium text-gray-900">My Stickers</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          {data.map((sticker) => {
            const isRemoving = removingStickerId === sticker.id;
            const formattedDeviceName =
              sticker.deviceType.charAt(0).toUpperCase() +
              sticker.deviceType.slice(1).toLowerCase();
            const userPhoneNumber = user?.primaryPhoneNumber?.toString();
            const formattedPhoneNumber = userPhoneNumber
              ? formatPhoneNumber(userPhoneNumber)
              : "";

            return (
              <div
                key={sticker.id}
                className={`group relative transition-opacity duration-500 ${
                  isRemoving ? "opacity-0" : "opacity-100"
                }`}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onTransitionEnd={(event) =>
                  isRemoving && onTransitionEnd(event, sticker.id)
                }
              >
                <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={sticker.stickerType.url}
                    alt={sticker.stickerType.name}
                    className="object-cover object-center"
                    width={605}
                    height={500}
                  />
                  <div
                    className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <div className="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
                      <a href={`sticker/${sticker.id}`}>View Sticker</a>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                  <h3>
                    <a href={`sticker/${sticker.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {formattedDeviceName}
                    </a>
                  </h3>
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                      <EllipsisVerticalIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
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
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                                onClick={() =>
                                  handleOpenRemoveStickerModal(sticker.id)
                                }
                              >
                                Remove sticker
                              </a>
                            )}
                          </Menu.Item>
                          {/* Additional Menu Items */}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <p className="mt-1 text-sm text-gray-500">{userEmail}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {formattedPhoneNumber}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
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
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
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
