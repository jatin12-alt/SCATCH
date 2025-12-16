const Footer = () => (
  <footer className="border-t border-surface bg-background/80">
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p>© {new Date().getFullYear()} Scatch. Crafted for premium bags.</p>
      <div className="flex gap-4">
        <a className="hover:text-accent" href="#shipping">
          Shipping
        </a>
        <a className="hover:text-accent" href="#returns">
          Returns
        </a>
        <a className="hover:text-accent" href="#support">
          Support
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;

