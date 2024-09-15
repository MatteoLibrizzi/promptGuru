"use client";

import { useQuery } from "react-query";
import PromptBox from "@/app/components/promptDisplay";
import { Loader } from "../loader";

export const PromptsByCategory = ({ category }: any) => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/prompts/category/${category}`);

      if (!res.ok) {
        throw new Error("Prompt not found");
      }

      return await res.json();
    },
    queryKey: ["recentPrompts"],
    retry: 1,
  });

  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
      {!isLoading &&
        !isError &&
        data?.prompts &&
        data.prompts.map((prompt: any) => {
          return (
            <PromptBox
              img={"https://iili.io/dwpImsj.md.png"}
              id={prompt.id}
              title={prompt.title}
              key={prompt.title}
              description={prompt.description}
            />
          );
        })}
      {isLoading && <Loader />}
      {isError && <h1>Error...</h1>}
    </div>
  );
};
