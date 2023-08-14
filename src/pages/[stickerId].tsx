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

  const rawPhoneNumber = data.ownerContactInfo.phone.replace(/\D/g, ""); // Remove all non-digits

  let formattedPhoneNumber = rawPhoneNumber;

  if (rawPhoneNumber.length === 10) {
    // Check if it's a valid 10-digit number
    const areaCode = rawPhoneNumber.slice(0, 3);
    const centralOfficeCode = rawPhoneNumber.slice(3, 6);
    const lineNumber = rawPhoneNumber.slice(6);
    formattedPhoneNumber = `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
  }

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
              src={data.stickerType.url}
              alt={data.stickerType.name}
            />
            <p className="mt-2 text-center text-sm text-gray-800">
              this {formattedDeviceName} has been lost.
            </p>
            <p className="mt-2 text-center text-sm text-gray-800">
              Please contact me.
            </p>
            <p className="mt-2 text-center text-sm text-gray-800">
              {formattedPhoneNumber}
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />

            <div className="flex flex-col space-y-4">
              <a
                href={`mailto:${data.ownerContactInfo.email}?subject=Lost Item&body=Hey I found your lost ${formattedDeviceName}!`}
              >
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                  Email
                </button>
              </a>
              <a
                href={`sms:${data.ownerContactInfo.phone}?&body=Hey I found your lost ${formattedDeviceName}!`}
              >
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                  Text
                </button>
              </a>
              <a href={`tel:${data.ownerContactInfo.phone}`}>
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                  Call
                </button>
              </a>
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
