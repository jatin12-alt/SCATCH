import { Leaf, Heart, Shield, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-12 h-12 sm:w-16 sm:h-16" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold">About SCATCH</h1>
          </div>
          <p className="text-lg sm:text-xl text-green-50 max-w-3xl mx-auto">
            Where luxury meets compassion. We craft premium vegan bags with sustainable materials, 
            proving that style and ethics can coexist beautifully.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-12">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6">Our Mission</h2>
            <p className="text-lg text-stone-700 leading-relaxed mb-4">
              At SCATCH, we believe that fashion should never come at the cost of animal welfare or environmental 
              sustainability. Our mission is to create beautiful, high-quality bags that are 100% vegan and 
              crafted from innovative, eco-friendly materials.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed">
              Every product we create is a statement—a commitment to a more compassionate and sustainable future. 
              We're not just selling bags; we're offering a way to express your values through timeless, elegant design.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <Heart className="w-12 h-12 text-green-700" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">Compassion</h3>
              <p className="text-stone-600">
                Every product is 100% vegan, ensuring no animals are harmed in the making of our bags.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <Leaf className="w-12 h-12 text-green-700" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">Sustainability</h3>
              <p className="text-stone-600">
                We use innovative materials like cork leather, recycled PET, and plant-based alternatives.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-green-700" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">Quality</h3>
              <p className="text-stone-600">
                Premium craftsmanship meets ethical production for bags that last a lifetime.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-green-700" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">Transparency</h3>
              <p className="text-stone-600">
                We're open about our materials, processes, and commitment to ethical practices.
              </p>
            </div>
          </div>
        </section>

        {/* Materials Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-12">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6">Innovative Materials</h2>
            <p className="text-lg text-stone-700 leading-relaxed mb-6">
              We source the finest vegan materials from around the world, each chosen for its durability, 
              beauty, and minimal environmental impact:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-semibold text-stone-800 mb-2">Cork Leather</h4>
                <p className="text-stone-600 text-sm">
                  Harvested from cork oak trees without harming them, creating a unique, water-resistant material.
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-semibold text-stone-800 mb-2">Recycled PET</h4>
                <p className="text-stone-600 text-sm">
                  Made from recycled plastic bottles, reducing waste while creating durable, stylish bags.
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-semibold text-stone-800 mb-2">Piñatex</h4>
                <p className="text-stone-600 text-sm">
                  Created from pineapple leaf fibers, a byproduct of the fruit industry.
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-semibold text-stone-800 mb-2">Mushroom Leather</h4>
                <p className="text-stone-600 text-sm">
                  Innovative material grown from mycelium, offering a sustainable alternative to traditional leather.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-lg p-8 sm:p-12 text-white">
            <h2 className="text-3xl font-serif font-bold mb-4">Join Our Mission</h2>
            <p className="text-lg text-green-50 mb-6 max-w-2xl mx-auto">
              Every purchase supports a more compassionate and sustainable future. 
              Explore our collection and find the perfect vegan bag that matches your style and values.
            </p>
            <a
              href="/"
              className="inline-block bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Shop Now
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

