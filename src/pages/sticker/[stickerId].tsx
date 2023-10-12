import { useRouter } from "next/router";
import { LoadingPage } from "@qrfound/components/navigation/loading";
import { api } from "@qrfound/utils/api";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const StickerPage = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingPage />;
  }

  const { stickerId } = router.query;

  if (!stickerId) return <LoadingPage />;
  return <StickerDetails stickerId={stickerId.toString()} user={user} />;
};

export default StickerPage;

type StickerDetailsProps = {
  stickerId: string;
  user: unknown;
};

const StickerDetails: React.FC<StickerDetailsProps> = ({ stickerId, user }) => {
  const { data, isLoading, error } = api.sticker.getStickerById.useQuery({
    stickerId,
  });

  if (isLoading) return <LoadingPage />;

  if (error && error.data && error.data.code === "UNAUTHORIZED") {
    return (
      <>
        <div className="flex min-h-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-3">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Lost Item Page
            </h2>
            {data && (
              <div className="relative mx-auto mb-4 mt-6 h-60 w-full">
                <Image
                  src={data.stickerType.url}
                  alt={data.stickerType.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
            <div className="text-center">
              Sign in to register this sticker
              <br></br>
              <SignInButton />
            </div>
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
              {data.owner.emailAddresses[0]?.emailAddress.toString() ||
                "Email not available"}
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="flex flex-col space-y-4">
              <a
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                href={`mailto:${data.owner.emailAddresses[0]?.emailAddress.toString()}?subject=Lost Item&body=Hey I found your lost ${formattedDeviceName}!`}
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
                href={`sms:${data.owner.phoneNumbers[0]?.phoneNumber.toString()}?&body=Hey I found your lost ${formattedDeviceName}!`}
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
                href={`tel:${data.owner.phoneNumbers[0]?.phoneNumber.toString()}`}
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
