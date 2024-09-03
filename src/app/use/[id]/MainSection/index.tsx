"use client";
import UseForm from "@/app/components/useForm";
import { useState } from "react";

export const MainSection = ({ id }: any) => {
  const [generatedString, setGeneratedString] = useState("");
  return (
    <>
      <UseForm setGeneratedString={setGeneratedString} id={id} />
      <h1 className="text-xl">{generatedString}</h1>
    </>
  );
};
