"use client";
import PromptForm from "@/app/components/promptForm";
import { useAuthOnPage } from "../hooks/useAuthOnPage";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useQuery } from "react-query";
import { Loader } from "../components/loader";
import { classNames } from "../utils";
import FormLine from "../components/dataDisplayLine";

export default function Add() {
  useAuthOnPage();

  const { data: dataSubcategories } = useQuery({
    queryFn: async () => {
      const res = await fetch("/api/getAllSubcategories");

      if (!res.ok) {
        throw new Error("Prompt not found");
      }

      return await res.json();
    },
    queryKey: ["getAllSubcategories"],
  });
  const [promptFields, setPromptFields] = useState([
    { promptBefore: "", name: "", description: "" },
  ]);
  const [lastPrompt, setLastPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState<string>("");
  const [creationStatus, setCreationStatus] = useState("NOT_CLICKED");

  const addCategory = (category: string) => {
    const copy = [...categories];
    copy.push(category);
    setCategories(copy);
  };
  const removeCategory = (category: string) => {
    const updatedCategories = categories.filter((cat) => cat !== category);
    setCategories(updatedCategories);
  };

  const addUserField = () => {
    setPromptFields([
      ...promptFields,
      { promptBefore: "", name: "", description: "" },
    ]);
  };

  const submit = async () => {
    setCreationStatus("PENDING");
    const promptTexts = promptFields.map((userField) => userField.promptBefore);
    promptTexts.push(lastPrompt);

    const promptUserTextFields = promptFields.map((userFields) => ({
      name: userFields.name,
      description: userFields.description,
    }));

    // TODO add img
    const res = await fetch("/api/add/v1", {
      body: JSON.stringify({
        title,
        description,
        promptTexts,
        promptUserTextFields,
        img: "",
        categories: categories,
      }),
      method: "POST",
    });

    if (res.ok) {
      setCreationStatus("SUCCESS");
    } else {
      setCreationStatus("ERROR");
    }
  };

  if (creationStatus === "SUCCESS") {
    setTimeout(() => {
      setCreationStatus("NOT_CLICKED");
    }, 10000);
  }

  const removeUserField = (index: number) => {
    const newFields = [...promptFields];
    newFields.splice(index, 1);
    setPromptFields(newFields);
  };

  return (
    <>
      {/* Background color split screen for large screens */}
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
                  <h1 className="font-bold text-xl pb-10">Model View:</h1>
                  <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div className="space-y-6 sm:space-y-5">
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          {title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          {description}
                        </p>
                      </div>

                      <div className="space-y-6 sm:space-y-5">
                        {promptFields &&
                          promptFields.map((field: any, i: number) => {
                            console.log(field);
                            return (
                              <>
                                <h1>{field.promptBefore}</h1>
                                <h1>[{field.name}]</h1>
                              </>
                            );
                          })}
                        <h1>{lastPrompt}</h1>
                      </div>
                    </div>
                  </div>
                </div>

                {/* End left column area */}
              </div>
            </div>

            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                {/* Start main area*/}
                <div className="relative h-full" style={{ minHeight: "36rem" }}>
                  <>
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                      <div className="space-y-6 sm:space-y-5">
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Add New Prompt
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            This Prompt will be available to use to the public,
                            you will be paid based on its usage following this
                            guidelines.
                            {/* TODO provide link to pdf with explanation */}
                          </p>
                        </div>

                        <div className="space-y-6 sm:space-y-5">
                          <FormLine
                            label={"Title"}
                            value={
                              <div className="border-indigo-400 border mt-1 sm:col-span-2 sm:mt-0 flex max-w-lg rounded-md shadow-sm">
                                <input
                                  type="text"
                                  name="title"
                                  id="title"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            }
                          />
                          <FormLine
                            label={"Description"}
                            value={
                              <div className="border-indigo-400 border mt-1 sm:col-span-2 sm:mt-0 flex max-w-lg rounded-md shadow-sm">
                                <input
                                  type="text"
                                  name="description"
                                  id="description"
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  value={description}
                                  className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            }
                          />

                          <Disclosure as="div" className="pt-4 border-gray-200">
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                                  <h1 className="font-bold text-lg text-gray-900">
                                    Categories
                                  </h1>
                                  <div className="grid grid-cols-4 gap-6">
                                    {categories.map((category, idx) => (
                                      <p
                                        key={category}
                                        className={`w-16 overflow-clip`}
                                      >
                                        {category}
                                      </p>
                                    ))}
                                  </div>
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
                                  <div className="">
                                    {dataSubcategories &&
                                      Object.keys(dataSubcategories).map(
                                        (category) => (
                                          <div key={category} className="">
                                            <Disclosure
                                              as="div"
                                              className="pt-2 border-gray-200"
                                            >
                                              {({ open }) => (
                                                <div className="ml-16">
                                                  <Disclosure.Button className="flex w-80 items-center justify-between bg-white py-3 text-sm text-gray-400">
                                                    <h1 className="font-bold text-medium text-gray-900">
                                                      {category}
                                                    </h1>
                                                    <span className="ml-6 flex items-center">
                                                      <ChevronDownIcon
                                                        className={classNames(
                                                          open
                                                            ? "-rotate-180"
                                                            : "rotate-0",
                                                          "h-5 w-5 transform"
                                                        )}
                                                        aria-hidden="true"
                                                      />
                                                    </span>
                                                  </Disclosure.Button>
                                                  <Disclosure.Panel className="pt-2">
                                                    {dataSubcategories[
                                                      category
                                                    ].map(
                                                      (
                                                        subCategory: string,
                                                        idx: number
                                                      ) => (
                                                        <div
                                                          key={`${category}-${subCategory}`}
                                                          className="flex items-center ml-16"
                                                        >
                                                          <input
                                                            id={`filter-mobile-${idx}`}
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                              if (
                                                                e.target.checked
                                                              ) {
                                                                addCategory(
                                                                  subCategory
                                                                );
                                                              } else {
                                                                removeCategory(
                                                                  subCategory
                                                                );
                                                              }
                                                            }}
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                          />
                                                          <label
                                                            htmlFor={`filter-mobile-${idx}`}
                                                            className="ml-3 text-sm text-gray-500"
                                                          >
                                                            {subCategory}
                                                          </label>
                                                        </div>
                                                      )
                                                    )}
                                                  </Disclosure.Panel>
                                                </div>
                                              )}
                                            </Disclosure>
                                          </div>
                                        )
                                      )}
                                    <div className="ml-16">
                                      <Disclosure
                                        as="div"
                                        className="pt-2 border-gray-200"
                                      >
                                        {({ open }) => (
                                          <>
                                            <Disclosure.Button className="flex w-80 items-center justify-between bg-white py-3 text-sm text-gray-400">
                                              <h1 className="font-bold italic text-medium text-gray-900">
                                                Custom Category
                                              </h1>
                                              <span className="ml-6 flex items-center">
                                                <ChevronDownIcon
                                                  className={classNames(
                                                    open
                                                      ? "-rotate-180"
                                                      : "rotate-0",
                                                    "h-5 w-5 transform"
                                                  )}
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="pt-2">
                                              <FormLine
                                                label={`Add Custom Category: `}
                                                value={
                                                  <div className=" mt-1 sm:col-span-2 sm:mt-0 flex max-w-lg rounded-md shadow-sm">
                                                    <input
                                                      type="text"
                                                      name={`custom-category`}
                                                      id={`custom-category`}
                                                      value={customCategory}
                                                      onChange={(e) => {
                                                        setCustomCategory(
                                                          e.target.value
                                                        );
                                                      }}
                                                      className="border-indigo-400 border block w-full max-w-lg rounded-md  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                                    />
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        addCategory(
                                                          customCategory
                                                        )
                                                      }
                                                      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    >
                                                      Add Category
                                                    </button>
                                                  </div>
                                                }
                                              />
                                            </Disclosure.Panel>
                                          </>
                                        )}
                                      </Disclosure>
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        </div>
                      </div>

                      <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Prompt Text and User Fields
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Provide the text to feed the LLM, and the names for
                            the fields the user should provide. They will be
                            concatenated in the provided order. You can leave
                            the Text fields empty, but User Fields must have a
                            name
                          </p>
                        </div>

                        <div className="space-y-6 sm:space-y-5">
                          {promptFields.map((field, index) => (
                            <div key={index} className="">
                              <FormLine
                                label={"Text"}
                                parentClassname={
                                  "sm:border-t sm:border-gray-200 sm:pt-5"
                                }
                                value={
                                  <div className="border-indigo-400 border mt-1 sm:col-span-2 sm:mt-0 flex max-w-lg rounded-md shadow-sm">
                                    <input
                                      type="text"
                                      name={`prompt-text-${index}`}
                                      id={`prompt-text-${index}`}
                                      value={field.promptBefore}
                                      onChange={(e) => {
                                        const newFields = [...promptFields];
                                        newFields[index].promptBefore =
                                          e.target.value;
                                        setPromptFields(newFields);
                                      }}
                                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                    />
                                  </div>
                                }
                              />
                              <FormLine
                                label={`User Field Name ${index + 1}`}
                                value={
                                  <div className="border-indigo-400 border mt-1 sm:col-span-2 sm:mt-0 flex max-w-lg rounded-md shadow-sm">
                                    <input
                                      type="text"
                                      name={`user-field-name-${index}`}
                                      id={`user-field-name-${index}`}
                                      value={field.name}
                                      onChange={(e) => {
                                        const newFields = [...promptFields];
                                        newFields[index].name = e.target.value;
                                        setPromptFields(newFields);
                                      }}
                                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                    />
                                  </div>
                                }
                              />
                              <FormLine
                                label={`User Field Description ${index + 1}`}
                                value={
                                  <div className="border-indigo-400 border mt-1 sm:col-span-2 sm:mt-0 flex max-w-lg rounded-md shadow-sm">
                                    <input
                                      type="text"
                                      name={`user-field-description-${index}`}
                                      id={`user-field-description-${index}`}
                                      value={field.description}
                                      onChange={(e) => {
                                        const newFields = [...promptFields];
                                        newFields[index].description =
                                          e.target.value;
                                        setPromptFields(newFields);
                                      }}
                                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                    />
                                  </div>
                                }
                              />
                              {index > 0 && (
                                <div className="mt-1 pt-2 sm:col-span-2 sm:mt-0">
                                  <button
                                    type="button"
                                    onClick={() => removeUserField(index)}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}

                          <FormLine
                            label={"Text"}
                            parentClassname={
                              "sm:border-t sm:border-gray-200 sm:pt-5"
                            }
                            value={
                              <div className="border-indigo-400 border mt-1 sm:col-span-2 sm:mt-0 flex max-w-lg rounded-md shadow-sm">
                                <input
                                  type="text"
                                  name="prompt-text-last"
                                  id="prompt-text-last"
                                  value={lastPrompt}
                                  onChange={(e) =>
                                    setLastPrompt(e.target.value)
                                  }
                                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                />
                              </div>
                            }
                          />
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <button
                              type="button"
                              onClick={addUserField}
                              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Add User Field
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        {creationStatus === "NOT_CLICKED" && (
                          <button
                            type="button"
                            onClick={submit}
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Add
                          </button>
                        )}
                        {creationStatus === "PENDING" && <Loader />}
                        {creationStatus === "SUCCESS" && (
                          <p className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Added ✅
                          </p>
                        )}
                        {creationStatus === "ERROR" && (
                          <p className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Error ❌
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                </div>
                {/* End main area */}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0">
            <div className="h-full py-6 pl-6 lg:w-80">
              {/* Start right column area */}
              <div className="relative h-full" style={{ minHeight: "16rem" }}>
                <h1 className="font-bold text-xl pb-10">User View:</h1>
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div className="space-y-6 sm:space-y-5">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {title}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {description}
                      </p>
                    </div>

                    <div className="space-y-6 sm:space-y-5">
                      {promptFields &&
                        promptFields.map((field: any, i: number) => {
                          console.log(field);
                          return (
                            <FormLine
                              key={field.name}
                              label={field.name}
                              subtitle={field.description}
                              value={
                                <textarea
                                  rows={8}
                                  value={""}
                                  disabled
                                  name={field.name}
                                  id={field.name}
                                  className="block h-12 p-2 w-10 min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              }
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
              {/* End right column area */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
