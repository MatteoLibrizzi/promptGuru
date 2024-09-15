"use client";

import { useQuery } from "react-query";
import FormLine from "../dataDisplayLine";
import { Disclosure } from "@headlessui/react";
import { classNames } from "@/app/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Loader } from "../loader";

export const UserUsage = () => {
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/userBalance`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    },
    queryKey: ["userBalance"],
  });

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/userTransactions`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    },
    queryKey: ["userTransactions"],
  });

  return (
    <div>
      {balanceData && (
        <FormLine
          label={`Credits`}
          value={
            <p className="block h-12 p-2 w-full min-w-0 flex-1 border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              {balanceData?.balance}
            </p>
          }
        />
      )}
      {balanceLoading && <Loader />}

      <Disclosure as="div" className="pt-4 border-gray-200">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
              <h1 className="font-bold text-lg text-gray-900">Transactions</h1>
              <div className="grid grid-cols-4 gap-6"></div>
              <span className="ml-6 flex items-center">
                <ChevronDownIcon
                  className={classNames(
                    open ? "-rotate-180" : "rotate-0",
                    "h-5 w-5 transform"
                  )}
                  aria-hidden="true"
                />
              </span>
            </Disclosure.Button>
            <Disclosure.Panel className="">
              {transactionsData?.transactions &&
                transactionsData?.transactions.map((transaction: any) => (
                  <FormLine
                    key={transaction.transactionTimestamp}
                    label={transaction.description}
                    subtitle={new Date(
                      transaction.transactionTimestamp
                    ).toLocaleString()}
                    value={transaction.amount}
                  />
                ))}
              {transactionsLoading && <Loader />}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
