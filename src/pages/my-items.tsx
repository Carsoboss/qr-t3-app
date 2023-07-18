

const products = [
  {
    id: 1,
    name: "Sticker Name",
    description:
      "This durable and portable insulated tumbler will keep your beverage at the perfect temperature during your next adventure.",
    href: "#",
    type: "Laptop",
    email: "f•••@example.com",
    phone: "1•••••••••40",
    status: "Preparing to ship",
    step: 1,
    date: "March 24, 2021",
    datetime: "2021-03-24",
    address: ["Floyd Miles", "7363 Cynthia Pass", "Toronto, ON N3Y 4H8"],
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-01.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
  {
    id: 2,
    name: "Sticker Name",
    description:
      "This durable and portable insulated tumbler will keep your beverage at the perfect temperature during your next adventure.",
    href: "#",
    type: "Laptop",
    email: "f•••@example.com",
    phone: "1•••••••••40",
    status: "Preparing to ship",
    step: 1,
    date: "March 24, 2021",
    datetime: "2021-03-24",
    address: ["Floyd Miles", "7363 Cynthia Pass", "Toronto, ON N3Y 4H8"],
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-01.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
  // More products...
];
const footerNavigation = {
  account: [
    { name: "Manage Account", href: "#" },
    { name: "Saved Items", href: "#" },
    { name: "Orders", href: "#" },
    { name: "Redeem Gift card", href: "#" },
  ],
  service: [
    { name: "Shipping & Returns", href: "#" },
    { name: "Warranty", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Find a store", href: "#" },
    { name: "Get in touch", href: "#" },
  ],
  company: [
    { name: "Who we are", href: "#" },
    { name: "Press", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Privacy", href: "#" },
  ],
  connect: [
    { name: "Instagram", href: "#" },
    { name: "Pinterest", href: "#" },
    { name: "Twitter", href: "#" },
  ],
};

export default function MyItems() {
  // add a message saying sticker added above the confirmation component. Users can now contact you by scanning your sticker. Put your sticker on your <device type> and scan it so others can contact you.

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-2xl pt-8 pb-24 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex w-full items-center justify-between sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              My Items
            </h1>
            {/* Actions */}
            <div className="flex items-center justify-end gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add another
              </a>
            </div>
          </div>
        </div>

        {/* Items */}
        <section aria-labelledby="products-heading" className="mt-6">
          <h2 id="products-heading" className="sr-only">
            Products purchased
          </h2>

          <div className="space-y-8">
            {products.map((product) => (
              <>
                <div
                  key={product.id}
                  className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >
                  <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                    <div className="sm:flex lg:col-span-7">
                      <div className="aspect-w-1 aspect-h-1 sm:aspect-none w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                        />
                      </div>

                      <div className="mt-6 w-full sm:mt-0 sm:ml-6">
                        <div className="flex w-full items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900">
                            {/* todo put device name above sticker name */}
                            <a href={product.href}>{product.name}</a>
                          </h3>
                          <a
                            href="#"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:block"
                          >
                            edit
                          </a>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {product.type}
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 text-sm font-medium" />
                        <p className="mt-2 text-sm text-gray-500">
                          {product.email}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {product.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
