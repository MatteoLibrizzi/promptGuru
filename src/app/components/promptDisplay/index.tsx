import Image from "next/image";

const PromptBox = ({ title, id, description, img }: any) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-square bg-gray-200 group-hover:opacity-75 sm:aspect-none ">
        <Image
          src={img}
          width={300}
          height={300}
          alt={"Prompt description"}
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <a href={`/use/${id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {title}
          </a>
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default PromptBox;
