import * as React from "react";
import { LoadingPage } from "@qrfound/components/navigation/loading";
import { api } from "@qrfound/utils/api";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function NewUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const mutation = api.users.addContactInfo.useMutation({
    onSuccess: () => {
      toast.success("Contact info successfully added!");
    },
    onError: () => {
      toast.error("An error occurred while adding contact info.");
    },
  });
  if (mutation.isLoading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <form className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="pt-8">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Finish setting up your account
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed on your stickers.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Phone
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="phone"
                      autoComplete="phone"
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex items-center justify-center">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  mutation.mutate({
                    email,
                    phone,
                  });
                }}
                className="ml-3 inline-flex justify-center rounded-md bg-violet-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
