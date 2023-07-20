import Image from 'next/image'

export default function Example() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-3">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Item Lost
            </h2>
            <img
              className="mx-auto mt-6 mb-4 h-60 w-auto"
              src="https://firebasestorage.googleapis.com/v0/b/qr-found.appspot.com/o/sticker%20type%20images%2FAstronaut_ScanMe_NoOutline.png?alt=media&token=225ee9b9-e4d9-475e-8d00-729c834cd6a6"
              alt="Your Company"
            />
            <p className="mt-2 text-center text-sm text-gray-800">
              This item has been lost. <br /> Please contact me.
            </p>
            <p className="mt-2 text-center text-sm text-gray-800">
              you@email.com
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 w-full"
              >
                Email
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 w-full"
              >
                Text
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-violet-500 py-3 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 w-full"
              >
                Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
