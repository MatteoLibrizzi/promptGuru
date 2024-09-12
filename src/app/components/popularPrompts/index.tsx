"use client";

import { useQuery } from "react-query";
import PromptBox from "../promptDisplay";

export const PopularPrompts = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      console.log("Pop promp");
      const res = await fetch("api/recentPrompts");
      return await res.json();
    },
    queryKey: ['recentPrompts']
  });

  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
      {!isLoading &&
        !isError &&
        data?.prompts?.length &&
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
      {isLoading && <h1>Loading...</h1>}
    </div>
  );
};
