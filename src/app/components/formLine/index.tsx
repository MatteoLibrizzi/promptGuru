const FormLine = ({ label: title, subtitle, input }: any) => {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
      <div className="flex flex-col ">
        <label
          htmlFor="title"
          className="text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {title}
        </label>
        {subtitle && (
          <label
            htmlFor="h2"
            className="text-xs font-small text-gray-500 sm:mt-px sm:pt-2 line-clamp-6 max-w-32 "
          >
            {subtitle}
          </label>
        )}
      </div>
      <div className="mt-1 sm:col-span-2 sm:mt-0">
        <div className="flex max-w-lg rounded-md shadow-sm">{input}</div>
      </div>
    </div>
  );
};

export default FormLine;
