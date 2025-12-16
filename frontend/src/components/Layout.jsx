import Header from './Header';
import Footer from './Footer';
import MiniCartFlyout from './MiniCartFlyout';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-background text-textPrimary">
    <Header />
    <main className="pt-20 pb-12 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">{children}</main>
    <MiniCartFlyout />
    <Footer />
  </div>
);

export default Layout;

