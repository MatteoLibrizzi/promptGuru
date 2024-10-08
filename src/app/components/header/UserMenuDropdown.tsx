"use client";
import { classNames } from "@/app/utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

export const UserMenuDropdown = () => {
  const { user, error, isLoading } = useUser();

  return (
    <>
      {!user && (
        <a
          href="/api/auth/login"
          className={
            "rounded-md px-3 py-2 text-sm font-medium text-indigo-200 hover:text-white"
          }
        >
          Login
        </a>
      )}
      {user && (
        <Menu as="div" className="relative ml-4 flex-shrink-0">
          <div>
            <Menu.Button className="flex rounded-full bg-indigo-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
              <span className="sr-only">Open user menu</span>
              <Image
                className="h-8 w-8 rounded-full"
                src={user.picture!}
                alt="User picture"
                width={500}
                height={500}
              />
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href={`/userPage`}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    User Page
                  </a>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/api/auth/logout"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-red-800"
                    )}
                  >
                    Logout
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </>
  );
};
