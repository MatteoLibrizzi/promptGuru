"use client";
import { classNames } from "@/app/utils";
import { HomeIcon, UsersIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useQuery } from "react-query";
import { UserUsage } from "../components/userUsage";

// TODO use this
const UserPage = ({ params }: { params: { id: string } }) => {
  const [selectedTab, setSelectedTab] = useState("Usage");

  const navigation = [
    { name: "Usage", href: "#", icon: HomeIcon },
    { name: "Created Prompts", href: "#", icon: UsersIcon },// TODO create api and repo method to get the prompts by user
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Navbar */}

      {/* 3 column wrapper */}
      <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
        {/* Left sidebar & main wrapper */}

        <div className="min-w-0 flex-1 bg-white xl:flex">
          <div className="border-b border-gray-200 bg-white xl:w-64 xl:flex-shrink-0 xl:border-b-0 xl:border-r xl:border-gray-200">
            <div className="h-full py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
              {/* Start left column area */}
              <div className="relative h-full" style={{ minHeight: "12rem" }}>
                <div className="space-y-1 px-2">
                  {navigation.map((item: any) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        setSelectedTab(item.name);
                      }}
                      className={classNames(
                        selectedTab === item.name
                          ? "bg-indigo-800 text-white"
                          : "text-indigo-100 hover:bg-indigo-600",
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-300"
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* End left column area */}
            </div>
          </div>

          <div className="bg-white lg:min-w-0 lg:flex-1">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="relative h-full" style={{ minHeight: "36rem" }}>
                Dashboard
                {selectedTab === "Usage" && <UserUsage />}
              </div>
              {/* End main area */}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0">
          <div className="h-full py-6 pl-6 lg:w-80">
            {/* Start right column area */}
            <div className="relative h-full" style={{ minHeight: "16rem" }}>
              {/* <div className="absolute inset-0 rounded-lg border-2 border-dashed border-gray-200" /> */}
              <button>Buy credits</button>
            </div>
            {/* End right column area */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
