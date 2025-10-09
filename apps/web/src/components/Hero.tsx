

export default function HeroSection() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 lg:pt-16 pb-4 sm:pb-8">
        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            {/* <p className="inline-flex px-4 py-2 text-base text-gray-700 border border-gray-300 rounded-full bg-white/60 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 mr-2" />
              Launch your store in minutes
            </p> */}
            <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
              Turn followers into customers with one link
            </h1>
            <p className="max-w-md mx-auto mt-6 text-base leading-7 text-gray-700">
              Share your link anywhere. We handle  payments, 
              and delivery so you can focus on what you do best—selling.
            </p>
            {/* Gradient Button */}
            <div className="relative inline-flex mt-10 group">
              <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"></div>
              <a
                href="#"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
              Create your store 
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
