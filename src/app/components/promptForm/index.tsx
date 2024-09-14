"use client";
import { classNames } from "@/app/utils";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useQuery } from "react-query";

const FormLine = ({ label, input, parentClassname }: any) => {
  return (
    <div
      className={
        "sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 " + parentClassname
      }
    >
      <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {label}
      </label>

      {input}
    </div>
  );
};

export default function PromptForm() {
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
  };

  const removeUserField = (index: number) => {
    const newFields = [...promptFields];
    newFields.splice(index, 1);
    setPromptFields(newFields);
  };

  console.log(dataSubcategories);

  return (
    <form className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Add New Prompt
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This Prompt will be available to use to the public, you will be
              paid based on its usage following this guidelines.
              {/* TODO provide link to pdf with explanation */}
            </p>
          </div>

          <div className="space-y-6 sm:space-y-5">
            <FormLine
              label={"Title"}
              input={
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg rounded-md shadow-sm">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              }
            />
            <FormLine
              label={"Description"}
              input={
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg rounded-md shadow-sm">
                    <input
                      type="text"
                      name="description"
                      id="description"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              }
            />

            <FormLine
              label={"Picture"}
              // TODO integrate with cloudinary https://console.cloudinary.com/pm/c-63cae420540f4e9e453e056f3304e1/media-explorer
              input={
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center">
                    <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Change
                    </button>
                  </div>
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
                        <p key={category} className={`w-16 overflow-clip`}>
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
                        Object.keys(dataSubcategories).map((category) => (
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
                                          open ? "-rotate-180" : "rotate-0",
                                          "h-5 w-5 transform"
                                        )}
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="pt-2">
                                    {dataSubcategories[category].map(
                                      (subCategory: string, idx: number) => (
                                        <div
                                          key={`${category}-${subCategory}`}
                                          className="flex items-center ml-16"
                                        >
                                          <input
                                            id={`filter-mobile-${idx}`}
                                            type="checkbox"
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                addCategory(subCategory);
                                              } else {
                                                removeCategory(subCategory);
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
                        ))}
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
              Provide the text to feed the LLM, and the names for the fields the
              user should provide. They will be concatenated in the provided
              order. You can leave the Text fields empty, but User Fields must
              have a name
            </p>
          </div>

          <div className="space-y-6 sm:space-y-5">
            {promptFields.map((field, index) => (
              <div key={index}>
                <FormLine
                  label={"Text"}
                  parentClassname={"sm:border-t sm:border-gray-200 sm:pt-5"}
                  input={
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name={`prompt-text-${index}`}
                        id={`prompt-text-${index}`}
                        value={field.promptBefore}
                        onChange={(e) => {
                          const newFields = [...promptFields];
                          newFields[index].promptBefore = e.target.value;
                          setPromptFields(newFields);
                        }}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                      />
                    </div>
                  }
                />
                <FormLine
                  label={`User Field Name ${index + 1}`}
                  input={
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
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
                  input={
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name={`user-field-description-${index}`}
                        id={`user-field-description-${index}`}
                        value={field.description}
                        onChange={(e) => {
                          const newFields = [...promptFields];
                          newFields[index].description = e.target.value;
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
              parentClassname={"sm:border-t sm:border-gray-200 sm:pt-5"}
              input={
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="prompt-text-last"
                    id="prompt-text-last"
                    value={lastPrompt}
                    onChange={(e) => setLastPrompt(e.target.value)}
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
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
