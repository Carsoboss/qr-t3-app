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
      toast.success("Sticker registration successful", {
        position: "bottom-center",
      });
      setHasShownToast(true);
    }
  }, [data?.wasUserDataAdded, hasShownToast]);

  if (isLoading) return <LoadingPage />;

  if (error && error.data && error.data.code === "UNAUTHORIZED") {
    return (
      <>
        <div className="flex min-h-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in or Create Your Account
            </h2>
            <p className="text-center text-gray-600">
              To register this sticker sign in or create an account
            </p>
            <SignUpButton>
              <div style={{ marginTop: "170px" }}>
                <div className="inline-flex w-full justify-center rounded-md bg-violet-500 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
                  Sign Up
                </div>
                <div style={{ marginTop: "80px" }}></div>
              </div>
            </SignUpButton>
          </div>
        </div>
      </>
    );
  }

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Sticker not found</div>;

  const deviceName = data.sticker.deviceType;
  const lowercase = deviceName.toLowerCase();
  const formattedDeviceName =
    lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
  console.log(data.owner.emailAddresses);
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
