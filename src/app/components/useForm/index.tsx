"use client";
import { useQuery } from "react-query";
import FormLine from "../formLine";
import { useEffect, useMemo, useState } from "react";

export default function PromptForm({ id }: any) {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/prompt/${id}`);
      return await res.json();
    },
  });

  {
    /* TODO return 404 if nor found*/
  }

  const [userContent, setUserContent] = useState<string[]>([]);
  useEffect(() => {
    if (!data?.userTextFields) {
      return;
    }
    setUserContent(data?.userTextFields.map((i: any) => ""));
  }, [data]);

  const submit = async () => {
    const res = await fetch(`/api/use/${id}`, {
      method: "POST",
      body: JSON.stringify(userContent),
    });

    return await res.json();
  };

  console.log(userContent);
  console.log(JSON.stringify(data));
  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {!isLoading && (
        <div className="space-y-8 divide-y divide-gray-200">
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
                {data?.userTextFields &&
                  data.userTextFields.map((field: any, i: number) => {
                    console.log(i);
                    return (
                      <>
                        <FormLine
                          key={field.name}
                          label={field.name}
                          subtitle={field.description}
                          input={
                            <textarea
                              rows={8}
                              value={userContent[i]}
                              onChange={(e) => {
                                const copy = Object.assign({}, userContent);

                                copy[i] = e.target.value;

                                setUserContent(copy);
                              }}
                              name={field.fieldName}
                              id={field.fieldName}
                              className="block h-12 p-2 w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
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
                onClick={submit}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
