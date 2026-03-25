import Hero from "@/components/ui/Hero";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Search Result Placeholder / Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all border border-gray-100">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                   <div className="absolute bottom-4 left-6 text-white font-bold text-xl">Destination {i}</div>
                </div>
                <div className="p-6">
                   <p className="text-sm text-gray-500 font-medium">Coming soon...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
