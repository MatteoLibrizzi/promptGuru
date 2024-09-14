"use client";
import { classNames } from "@/app/utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

const prices = [
  {
    priceId: "price_1PyvGoDZkjJgjhGtNFZiNUxw",
    credits: 390,
    amount: "€ 5.00",
    avgUsages: 3500,
  },
  {
    priceId: "price_1PyvHoDZkjJgjhGtWBVOhfUT",
    credits: 900,
    amount: "€ 10.00",
    avgUsages: 8500,
  },
  {
    priceId: "price_1PyvIIDZkjJgjhGtiZCUhtHU",
    credits: 1900,
    amount: "€ 20.00",
    avgUsages: 19000,
  },
  {
    priceId: "price_1PyvrUDZkjJgjhGtL3y2UAZv",
    credits: 3900,
    amount: "€ 50.00",
    avgUsages: 39000,
  },
];

export const BuyCreditsDropdown = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  const handleBuyClick = async (priceId: string) => {
    const res = await fetch(`/api/buyCredits/${priceId}`, {});

    if (!res.ok) {
      throw new Error("Failed to buy credits");
    }
    const jsonResponse = await res.json();
    router.push(jsonResponse.url);
  };

  return (
    <>
      {!user && (
        <a
          href="/api/auth/login"
          className={
            "rounded-md px-3 py-2 text-sm font-medium text-indigo-200 hover:text-white"
          }
        >
          Buy Credits
        </a>
      )}
      {user && (
        <Menu as="div" className="relative ml-4 flex-shrink-0">
          <div>
            <Menu.Button className="flex  text-sm rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
              <h1 className="">Buy Credits</h1>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {prices.map((price) => (
                <Menu.Item key={price.priceId}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        handleBuyClick(price.priceId);
                      }}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      {price.credits} credits for {price.amount} -&rarr;{" "}
                      ~{price.avgUsages} Usages
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </>
  );
};
