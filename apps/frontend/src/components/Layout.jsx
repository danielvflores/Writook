import Navbar from '../components/Navbar';
//import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;