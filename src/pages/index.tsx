/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import React from "react";
import Head from "next/head";
import {
  CursorArrowRaysIcon,
  ViewfinderCircleIcon,
  HandRaisedIcon,
  ScissorsIcon,
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon,
} from "@heroicons/react/20/solid";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

const Welcome: NextPage = () => {
  const primaryFeatures = [
    {
      name: "Scan your sticker.",
      description: "Open your camera app and scan the QR code on your sticker.",
      icon: ViewfinderCircleIcon,
    },
    {
      name: "Choose what you want to do with it.",
      description:
        "In the QRfound app you can choose what you want to do with your sticker. You can select an item to put it on and verify your ownership.",
      icon: CursorArrowRaysIcon,
    },
    {
      name: "Place your sticker.",
      description:
        "Put your sticker on your item. Then scan away and never lose your item again. You can also show your friends that you own this item.",
      icon: HandRaisedIcon,
    },
  ];
  const secondaryFeatures = [
    {
      name: "Stylin",
      description:
        "Compliment your style with hand drawn stickers. We have a wide range of stickers to choose from.",
      href: "#",
      icon: ScissorsIcon,
    },
    {
      name: "Versatile",
      description:
        "Keep an eye on your uniquely shaped items such as water bottles, laptops, and more.",
      href: "#",
      icon: AdjustmentsHorizontalIcon,
    },
    {
      name: "Convenient",
      description:
        "Affordable and convenient. You'll never lose your items again.",
      href: "#",
      icon: CheckBadgeIcon,
    },
  ];

  return (
    <>
      <Head>
        <title>QRfound</title>
        <meta
          name="description"
          content="Never lose your items again with QRfound. Add your information to a QR code sticker and easily track your belongings."
        />
        <meta
          name="keywords"
          content="QRfound, QR code stickers, item tracking, lost items, QR stickers, item security"
        />
      </Head>
      <div className="relative isolate bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to QRfound
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              QRfound allows you to add your information to a QR code sticker so
              you will never lose your items again.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="my-stickers"
                className="rounded-md bg-violet-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                Get started
              </a>
              <div className="text-sm font-semibold leading-6 text-gray-900">
                <SignedIn>
                  <SignOutButton aria-hidden="true">Sign out →</SignOutButton>
                </SignedIn>
                <SignedOut>
                  <SignInButton aria-hidden="true"> Sign in →</SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <svg
              viewBox="0 0 366 729"
              role="img"
              className="mx-auto w-[22.875rem] max-w-full drop-shadow-xl"
            >
              <title>App screenshot</title>
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect width={316} height={684} rx={36} />
                </clipPath>
              </defs>
              <path
                fill="#4B5563"
                d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z"
              />
              <path
                fill="#343E4E"
                d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z"
              />
              <foreignObject
                width={316}
                height={684}
                transform="translate(24 24)"
                clipPath="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/qr-found.appspot.com/o/landing%20page%2FScreen%20(Replace%20Here).png?alt=media&token=825d75e5-6ece-4761-bf7d-a6ade0f8e53c"
                  alt=""
                />
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <main className="mb-32">
          {/* Feature section */}
          <div className="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-20 sm:rounded-3xl sm:px-10 sm:py-24 lg:py-24 xl:px-24">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
                <div className="lg:row-start-2 lg:max-w-md">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    How does it work?
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-gray-300">
                    QRfound helps you never lose anything again by adding your
                    contact information to your frequently lost items. Simply
                    follow the steps below to get started.
                  </p>
                </div>
                <img
                  // src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
                  src="https://firebasestorage.googleapis.com/v0/b/qr-found.appspot.com/o/landing%20page%2FiPhone%2012%20-%20Scan%20(1).png?alt=media&token=d465c765-5381-4df9-ab0f-e971a9280604"
                  alt="Product screenshot"
                  className="relative -z-20 max-h-96 w-auto min-w-full max-w-xl rounded-xl object-contain ring-white/10 lg:row-span-4 lg:max-h-[56rem] lg:max-w-none"
                  width={2432}
                  height={1442}
                />
                <div className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10 ">
                  <dl className="max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                    {primaryFeatures.map((feature) => (
                      <div key={feature.name} className="relative">
                        <dt className="ml-9 inline-block font-semibold text-white">
                          <feature.icon
                            className="absolute left-1 top-1 h-5 w-5 text-violet-500"
                            aria-hidden="true"
                          />
                          {feature.name}
                        </dt>{" "}
                        <dd className="inline">{feature.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <svg
                className="pointer-events-none absolute left-12 top-1/2 -z-10 h-[42.375rem] -translate-y-1/2 transform-gpu blur-3xl lg:bottom-[-12rem] lg:top-auto lg:translate-y-0"
                viewBox="0 0 1155 678"
                fill="none"
              >
                <path
                  fill="url(#c0458c57-1330-459f-9d5c-f0d75c210466)"
                  fillOpacity=".25"
                  d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                />
                <defs>
                  <linearGradient
                    id="c0458c57-1330-459f-9d5c-f0d75c210466"
                    x1="1155.49"
                    x2="-78.208"
                    y1=".177"
                    y2="474.645"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9089FC" />
                    <stop offset={1} stopColor="#FF80B5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Feature section */}
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-violet-500">
                As unique as your items
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                The QRfound difference
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Enjoy an inexpensive alternative to expensive tracking devices.
                QRfound is a simple and easy way to keep tabs on your items.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {secondaryFeatures.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                      <feature.icon
                        className="h-5 w-5 flex-none text-violet-500"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Welcome;
