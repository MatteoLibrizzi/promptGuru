"use client";
import { useQuery } from "react-query";
import FormLine from "../formLine";

export default function PromptForm({ id }: any) {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/prompt/${id}`);
      return await res.json();
    },
  });

  console.log(data);
  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {!isLoading && (
        <form className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {data.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {data.description}
                </p>
              </div>

              <div className="space-y-6 sm:space-y-5">
                {data.userTextFields.map((field: any) => {
                  return (
                    <>
                      <FormLine
                        key={field.fieldName}
                        label={field.fieldName}
                        input={
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <div className="flex max-w-lg rounded-md shadow-sm">
                              <input
                                type="text"
                                name={field.fieldName}
                                id={field.fieldName}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        }
                      />
                      <FormLine
                        key={field.fieldDescription}
                        label={field.fieldDescription}
                        input={
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <div className="flex max-w-lg rounded-md shadow-sm">
                              <input
                                type="text"
                                name={field.fieldDescription}
                                id={field.fieldDescription}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        }
                      />
                    </>
                  );
                })}
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
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
