"use client";

import { useQuery } from "react-query";
import PromptBox from "@/app/components/promptDisplay";

const images = [
  "https://iili.io/drWKteI.md.jpg",
  "https://iili.io/drWo4st.th.png",
  "https://iili.io/drWnCyQ.th.jpg",
  "https://iili.io/drWzOAv.th.jpg",
];

export const PopularPrompts = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const res = await fetch("/api/prompts");

      if (!res.ok) {
        throw new Error("Prompt not found");
      }

      return await res.json();
    },
    queryKey: ["recentPrompts"],
  });

  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
      {!isLoading &&
        !isError &&
        data?.prompts &&
        data.prompts.map((prompt: any, idx: number) => {
          return (
            <PromptBox
              img={images[idx % 4]}
              id={prompt.id}
              title={prompt.title}
              key={prompt.title}
              description={prompt.description}
              categories={prompt.categories}
            />
          );
        })}
      {isLoading && <h1>Loading...</h1>}
      {isError && <h1>Couldnt load prompts</h1>}
    </div>
  );
};
