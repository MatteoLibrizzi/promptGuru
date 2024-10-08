import { PromptsByCategory } from "@/app/components/promptsByCategory";

export default function Category({ params }: any) {
  console.log(params.category);

  return (
    <>
      {/* Background color split screen for large screens */}
      <div className="relative flex min-h-screen flex-col">
        {/* Navbar */}

        {/* 3 column wrapper */}
        <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
          {/* Left sidebar & main wrapper */}
          <div className="min-w-0 flex-1 bg-white xl:flex">
            <div className="border-b border-gray-200 bg-white xl:w-64 xl:flex-shrink-0 xl:border-b-0 xl:border-r xl:border-gray-200">
              <div className="h-full py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                {/* Start left column area */}
                <div className="relative h-full" style={{ minHeight: "12rem" }}>
                  <h1>Use prompts from other users, pay based on usage.</h1>
                </div>

                {/* End left column area */}
              </div>
            </div>

            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                {/* Start main area*/}
                <div className="relative h-full" style={{ minHeight: "36rem" }}>
                  {/* <div className="absolute inset-0 rounded-lg border-2 border-dashed border-gray-200" /> */}
                  <h1 className="pb-10">Category</h1>
                  <PromptsByCategory category={params.category} />
                </div>

                {/* End main area */}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0">
            <div className="h-full py-6 pl-6 lg:w-80">
              {/* Start right column area */}
              <div className="relative h-full" style={{ minHeight: "16rem" }}>
                <h1>Create your own prompts and get paid based on usage.</h1>
              </div>
              {/* End right column area */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
