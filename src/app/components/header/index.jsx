"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { classNames } from "@/app/utils";
import { UserMenuDropdown } from "@/app/components/header/UserMenuDropdown";
import { useQuery } from "react-query";
import { useAuthOnPage } from "@/app/hooks/useAuthOnPage";

export default function Header() {
  useAuthOnPage();
  const [open, setOpen] = useState(false);

  const {
    data: categories,
    error: errorCategories,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch("/api/getAllSubcategories");
      return await res.json();
    },
    queryKey: ["getAllSubcategories"],
  });

  return (
    <div className="flex-shrink-0 bg-indigo-600">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center px-2 lg:px-0 xl:w-64">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
                alt="Your Company"
              />
            </div>
          </div>

          <nav
            aria-label="Top"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className=" flex h-16 items-center">
              {/* MOBILE */}
              <Transition.Root show={open} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-40 lg:hidden"
                  onClose={setOpen}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 z-40 flex">
                    <Transition.Child
                      as={Fragment}
                      enter="transition ease-in-out duration-300 transform"
                      enterFrom="-translate-x-full"
                      enterTo="translate-x-0"
                      leave="transition ease-in-out duration-300 transform"
                      leaveFrom="translate-x-0"
                      leaveTo="-translate-x-full"
                    >
                      <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                        <div className="flex px-4 pt-5 pb-2">
                          <button
                            type="button"
                            className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>

                        <Tab.Group as="div" className="mt-0">
                          <div className="border-b border-gray-200">
                            <Tab.List className="-mb-px flex space-x-8 px-4">
                              <Tab
                                key="Categories"
                                className={({ selected }) =>
                                  classNames(
                                    selected
                                      ? "text-indigo-600 border-indigo-600"
                                      : "text-gray-900 border-transparent",
                                    "flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium"
                                  )
                                }
                              >
                                Categories
                              </Tab>
                            </Tab.List>
                          </div>
                          <Tab.Panels as={Fragment}>
                            <Tab.Panel
                              key="Categories"
                              className="space-y-10 px-4 pt-10 pb-8"
                            >
                              {categories &&
                                Object.keys(categories).map((category) => (
                                  <div key={category}>
                                    <p
                                      id={`${category}-heading-mobile`}
                                      className="font-medium text-gray-900"
                                    >
                                      {category}
                                    </p>

                                    <ul
                                      role="list"
                                      aria-labelledby={`${category}-heading-mobile`}
                                      className="mt-6 flex flex-col space-y-6"
                                    >
                                      {categories[category].map(
                                        (subCategory) => (
                                          <li
                                            key={subCategory}
                                            className="flow-root"
                                          >
                                            <a
                                              href={subCategory}
                                              className="-m-2 block p-2 text-gray-500"
                                            >
                                              {subCategory}
                                            </a>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                ))}
                            </Tab.Panel>
                          </Tab.Panels>
                        </Tab.Group>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>
              {/* Full Screen */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  <Popover key={"Categories"} className="flex">
                    {({ open }) => (
                      <>
                        <div className="relative flex">
                          <Popover.Button
                            className={classNames(
                              open
                                ? "border-indigo-600 text-white"
                                : "border-transparent text-white hover:text-gray-200",
                              "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                            )}
                          >
                            Categories
                          </Popover.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Popover.Panel className="absolute inset-x-0 z-10 top-full text-sm text-gray-500">
                            {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                            <div
                              className="absolute inset-0 top-1/2 bg-white shadow"
                              aria-hidden="true"
                            />

                            <div className="relative bg-white">
                              <div className="mx-auto max-w-7xl px-8">
                                <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                                  <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                                    {categories &&
                                      Object.keys(categories).map(
                                        (category) => (
                                          <div key={category}>
                                            <p
                                              id={`${category}-heading`}
                                              className="font-medium text-gray-900"
                                            >
                                              {category}
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby={`${category}-heading`}
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {categories[category].map(
                                                (subCategory) => (
                                                  <li
                                                    key={subCategory}
                                                    className="flex"
                                                  >
                                                    <a
                                                      href={subCategory}
                                                      className="hover:text-gray-800"
                                                    >
                                                      {subCategory}
                                                    </a>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </div>
              </Popover.Group>
              <div className="block w-80 lg:pr-0 pr-10">
                <div className="flex items-center justify-end">
                  <div className="flex">
                    <a
                      href="/add"
                      className="rounded-md px-3 py-2 text-sm font-medium text-indigo-200 hover:text-white"
                    >
                      + Add Prompt
                    </a>
                  </div>
                  {/* Profile dropdown */}
                  <UserMenuDropdown />
                </div>
              </div>
              <button
                type="button"
                className="rounded-md  p-2 text-white lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
