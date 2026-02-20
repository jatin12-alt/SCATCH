import { Leaf, Heart, Sparkles, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&q=80"
            alt="Artisanal Workshop"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center animate-in fade-in zoom-in duration-1000">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">
            A New Standard of Luxury.
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto font-medium leading-relaxed">
            We've stripped away the shortcuts to build something meaningful.
            Luxury shouldn't be a compromise—it should be a statement of compassion.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-12 text-center mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 block mb-4">Our Narrative</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tighter">Crafted with Conscience</h2>
          </div>

          <div className="md:col-span-6 space-y-6">
            <p className="text-lg text-stone-600 leading-relaxed font-medium">
              SCATCH wasn't born in a boardroom. It was born from a simple observation: the industry's definition of "premium" often ignored the environmental and ethical toll of production.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed font-medium">
              We spent years sourcing materials that didn't just look like leather, but outperformed it. From the rugged texture of cork to the buttery softness of grape-harvest fibers, every piece we create is a testament to innovation.
            </p>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1614251053245-20739962a220?w=400&q=80" alt="Material" className="w-full h-full object-cover grayscale" />
            </div>
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mt-8">
              <img src="https://images.unsplash.com/photo-1591348122449-02525d70e303?w=400&q=80" alt="Craft" className="w-full h-full object-cover grayscale" />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-stone-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="text-2xl font-serif font-black text-white">Absolute Compassion</h3>
              <p className="text-stone-400 leading-relaxed">We are strictly vegan. No exceptions, no compromise. Every thread and adhesive is 100% animal-free.</p>
            </div>

            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Sprout className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-serif font-black text-white">Ecological Integrity</h3>
              <p className="text-stone-400 leading-relaxed">Our materials are sourced from the earth's regenerative bounty—mushroom, apple, and recycled fibers.</p>
            </div>

            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-black text-white">Artisan Standards</h3>
              <p className="text-stone-400 leading-relaxed">Sustainability shouldn't mean sacrificing longevity. Our bags are designed to be loved for a lifetime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Material Library */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <header className="text-center mb-20">
          <h2 className="text-4xl font-serif font-black text-stone-900 tracking-tighter">The Library of Origin</h2>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.3em] mt-3">Sourcing the Future</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: 'Grape Skins',
              desc: 'Byproducts of the Italian wine industry, transformed into a supple, high-durability polymer.',
              img: 'https://images.unsplash.com/photo-1533150834822-b0cb10ef3535?w=600&q=80'
            },
            {
              name: 'Cork Bark',
              desc: 'Naturally harvested without ever harming the tree, providing a waterproof, organic texture.',
              img: 'https://images.unsplash.com/photo-1562914399-70899d39999a?w=600&q=80'
            },
            {
              name: 'Ocean Polymers',
              desc: 'Recovered plastic waste, refined into a high-tensile, sleek nylon alternative.',
              img: 'https://images.unsplash.com/photo-1548991894-3965568112d7?w=600&q=80'
            },
            {
              name: 'Mycelium',
              desc: 'Grown from mushrooms, this material mimics the cellular structure of classic leather.',
              img: 'https://images.unsplash.com/photo-1504198453319-5ce911baf2ea?w=600&q=80'
            }
          ].map((m, i) => (
            <div key={i} className="group relative rounded-[2rem] overflow-hidden aspect-[16/9] shadow-2xl shadow-stone-200">
              <img src={m.img} alt={m.name} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-2xl font-serif font-black text-white mb-2">{m.name}</h4>
                <p className="text-stone-300 text-sm font-medium leading-relaxed max-w-sm">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-green-800 py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tighter mb-8 italic">Part of the change.</h2>
          <p className="text-green-100 mb-10 text-lg font-medium">Join us in proving that luxury can be kind, ethical, and absolute.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-stone-900 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-100 transition-all shadow-xl shadow-green-900/50"
          >
            Explore the Collection
          </button>
        </div>
      </section>
    </div>
  );
}

