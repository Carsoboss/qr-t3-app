import { useState, useEffect } from "react";
import { api } from "@qrfound/utils/api";
import { LoadingPage } from "@qrfound/components/navigation/loading";
import { toast } from "react-hot-toast";

const UpdateItemForm = () => {
  const [itemType, setItemType] = useState(null);
  const [showOther, setShowOther] = useState(false);
  const { data, isLoading: stickersLoading } =
    api.sticker.getStickersByUser.useQuery();

  const mutation = api.sticker.updateDeviceType.useMutation({
    onSuccess: () => {
      toast.success("Device type successfully updated!");
    },
    onError: () => {
      toast.error("An error occurred while updating device type.");
    },
  });

  useEffect(() => {
    if (!stickersLoading && data && data.length > 0) {
      setItemType(data[0]?.sticker.deviceType);
    }
  }, [data, stickersLoading]);

  useEffect(() => {
    setShowOther(itemType === "Other");
  }, [itemType]);

  if (stickersLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="bg-gray-50">
      <main>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 sm:pb-32 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:col-start-1 lg:row-span-2 lg:self-center">
              <div className="aspect-w-1 aspect-h-1 max-h-72 overflow-hidden rounded-lg lg:max-h-[none]">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot.jpg"
                  alt="Light green canvas bag with black straps, handle, front zipper pouch, and drawstring top."
                  className="h-full max-h-72 w-full object-contain object-center lg:max-h-[none]"
                />
              </div>
            </div>

            <div className="lg:max-w-lg lg:self-end">
              <div className="mt-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Update Item
                </h1>
              </div>

              <section
                aria-label="Item Information"
                className="col-span-6 mt-4"
              >
                <div className="grid-row-1 sm:grid-row-6 grid gap-y-6 gap-x-4 pt-4">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="item-type"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      What is this for?
                    </label>
                    <div className="mt-2">
                      <select
                        name="item-type"
                        id="item-type"
                        className="block h-9 w-full rounded-md border-0 py-1.5 pl-2 pr-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                      >
                        <option>Water Bottle</option>
                        <option>Phone</option>
                        <option>Tablet</option>
                        <option>Computer</option>
                        <option>Wallet</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {showOther && (
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Item Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-violet-500 py-2.5 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                    onClick={(e) => {
                      e.preventDefault();
                      // Assuming the sticker ID is in data[0].sticker.id
                      // This is just a placeholder, adjust according to your actual sticker ID structure
                      mutation.mutate({
                        stickerId: data[0].sticker.id,
                        newDeviceType: itemType,
                      });
                    }}
                  >
                    Submit
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateItemForm;
