import type { NextPage } from "next";
import { useRouter } from "next/router";
import { LoadingPage } from "@qrfound/components/navigation/loading";
import { api } from "@qrfound/utils/api";

const StickerDetails: NextPage<{ stickerId: string }> = ({ stickerId }) => {
  const { data, isLoading } = api.sticker.getStickerById.useQuery({
    stickerId,
  });

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Sticker not found</div>;

  const deviceName = data.deviceType;
  const lowercase = deviceName.toLowerCase();
  const formattedDeviceName =
    lowercase.charAt(0).toUpperCase() + lowercase.slice(1);

  const firstName = data.ownerContactInfo.firstName;
  const lower = firstName.toLowerCase();
  const formattedfirstName = lower.charAt(0).toUpperCase() + lower.slice(1);

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-3">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {formattedDeviceName} Lost
            </h2>
            <img
              className="mx-auto mt-6 mb-4 h-60 w-auto"
              src="https://firebasestorage.googleapis.com/v0/b/qr-found.appspot.com/o/sticker%20type%20images%2FAstronaut_ScanMe_NoOutline.png?alt=media&token=225ee9b9-e4d9-475e-8d00-729c834cd6a6"
              alt="Your Company"
            />
            <p className="mt-2 text-center text-sm text-gray-800">
              You found {formattedfirstName}&apos;s lost {formattedDeviceName}
            </p>
            <p className="mt-2 text-center text-sm text-gray-800">
              Send a message to let them know you found it!
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                Email
              </button>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                Text
              </button>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const StickerPage: NextPage = () => {
  const router = useRouter();
  const { stickerId } = router.query;

  if (!stickerId) return <LoadingPage />; // Show a loading state while waiting for stickerId

  return <StickerDetails stickerId={stickerId.toString()} />;
};

export default StickerPage;
