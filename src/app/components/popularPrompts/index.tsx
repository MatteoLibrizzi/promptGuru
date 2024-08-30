"use client";

import { useQuery } from "react-query";

export const PopularPrompts = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const res = await fetch("api/recentPrompts");
      return res.json();
    },
  });
  console.log(data);

  return (
    <div>
      {!isLoading &&
        !isError &&
        data.prompts.map((prompt: any) => {
          return <button key={prompt.title}>{prompt.title}</button>;
        })}
      {isLoading && <h1>Loading...</h1>}
    </div>
  );
};
