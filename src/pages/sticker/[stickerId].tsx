import { useRouter } from "next/router";
import { LoadingPage } from "@qrfound/components/navigation/loading";
import { api } from "@qrfound/utils/api";
import Image from "next/image";
import { SignUpButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const StickerPage = () => {
  const router = useRouter();
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingPage />;
  }

  const { stickerId } = router.query;

  if (!stickerId) return <LoadingPage />;
  return <StickerDetails stickerId={stickerId.toString()} />;
};

export default StickerPage;

type StickerDetailsProps = {
  stickerId: string;
};

const StickerDetails: React.FC<StickerDetailsProps> = ({ stickerId }) => {
  const { data, isLoading, error } = api.sticker.getStickerById.useQuery(
    {
      stickerId,
    },
    {
      retry: 1,
    }
  );
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (data?.wasUserDataAdded && !hasShownToast) {
      toast.success("Sticker added", {
        position: "bottom-center",
      });
      setHasShownToast(true);
    }
  }, [data?.wasUserDataAdded, hasShownToast]);

  if (isLoading) return <LoadingPage />;

  if (error && error.data && error.data.code === "UNAUTHORIZED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-start px-4 pt-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Key icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mx-auto h-16 w-16 text-purple-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
            />
          </svg>

          <h2 className="mt-4 pt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Activate your Sticker
          </h2>

          <p className="pt-6 text-center text-gray-600">
            Sign in or create an <br className="sm:hidden" />
            account to activate your sticker.
          </p>

          <SignUpButton>
            <div className="mt-8 flex w-full justify-center">
              <div className="rounded-md bg-violet-500 px-4 py-2 shadow-sm hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
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
                  Activate sticker
                </span>
              </div>
            </div>
          </SignUpButton>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        role="alert"
      >
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }
  if (!data) {
    return (
      <div
        className="border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700"
        role="alert"
      >
        <p className="font-bold">Notice</p>
        <p>Sticker not found.</p>
      </div>
    );
  }

  const deviceName = data.sticker.deviceType;
  const lowercase = deviceName.toLowerCase();
  const formattedDeviceName =
    lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
  const primaryPhone = data.owner.phoneNumbers.find(
    (PhoneNumber) => PhoneNumber.id === data.owner.primaryPhoneNumberId
  );
  const primaryEmail = data.owner.emailAddresses.find(
    (EmailAddress) => EmailAddress.id === data.owner.primaryEmailAddressId
  );
  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-3">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {formattedDeviceName} Lost
            </h2>
            <div className="relative mx-auto mb-4 mt-6 h-60 w-full">
              <Image
                src={data.stickerType.url}
                alt={data.stickerType.name}
                layout="fill"
                objectFit="contain"
                // width={448}
                // height={224}
                priority
              />
            </div>
            <p className="mt-2 text-center text-sm text-gray-800">
              This {formattedDeviceName} has been lost.
            </p>
            <p className="mt-2 text-center text-sm text-gray-800">
              Please contact me.
            </p>
            <p className="mt-2 text-center text-sm text-gray-800">
              {primaryEmail?.emailAddress.toString() || "Email not available"}
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="flex flex-col space-y-4">
              <a
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                href={`mailto:${primaryEmail?.emailAddress.toString()}?subject=Lost Item&body=Hey I found your lost ${formattedDeviceName}!`}
              >
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-violet-500 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                  Email
                </button>
              </a>
              <a
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                href={`sms:${primaryPhone?.phoneNumber.toString()}?&body=Hey I found your lost ${formattedDeviceName}!`}
              >
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-violet-500 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                  Text
                </button>
              </a>
              <a
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                href={`tel:${primaryPhone?.phoneNumber.toString()}`}
              >
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-violet-500 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
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
