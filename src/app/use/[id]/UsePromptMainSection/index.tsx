"use client";
import { isError, useQuery } from "react-query";
import FormLine from "@/app/components/formLine";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function UsePromptMainSection({ id }: any) {
  const {
    data: promptData,
    isLoading: promptIsLoading,
    isError: promptIsError,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/prompt/${id}`);

      if (!res.ok) {
        throw new Error("Prompt not found");
      }
      return await res.json();
    },
    queryKey: ["prompt", id],
  });

  const { user, error, isLoading, checkSession } = useUser();

  const [generatedString, setGeneratedString] = useState("");

  const [submited, setSubmited] = useState(false);
  const [userContent, setUserContent] = useState<string[]>([]);
  const router = useRouter();

  const {
    isLoading: generatedResponseIsLoading,
    isError: generatedResponseIsError,
  } = useQuery({
    queryFn: async () => {
      if (!user) {
        router.push("/api/auth/login");
        return;
      }

      setSubmited(false);
      const res = await fetch(`/api/use/${id}`, {
        method: "POST",
        body: JSON.stringify(userContent),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      return await res.json();
    },
    enabled: submited,
    queryKey: ["use", id, userContent],
    onSuccess: (data) => {
      setGeneratedString(data.generated);
    },
  });

  useEffect(() => {
    if (!promptData?.userTextFields) {
      return;
    }
    setUserContent(promptData?.userTextFields.map((i: any) => ""));
  }, [promptData]);

  return (
    <>
      <div className="mb-8">
        {promptIsLoading && <h1>Loading...</h1>}
        {promptIsError && <h1>Error Loading the Prompt</h1>}
        {!promptIsLoading && !promptIsError && (
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {promptData.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {promptData.description}
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-5">
                  {promptData?.userTextFields &&
                    promptData.userTextFields.map((field: any, i: number) => {
                      return (
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
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSubmited(true);
                  }}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {!generatedResponseIsLoading &&
        !generatedResponseIsError &&
        generatedString && (
          <h1 className="text-s whitespace-pre-wrap	">{generatedString}</h1>
        )}
      {generatedResponseIsLoading && <h1>Loading...</h1>}
      {generatedResponseIsError && <h1>Error</h1>}
    </>
  );
}
