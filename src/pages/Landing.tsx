
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-linkeblue-800 to-linkeblue-600 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Streamlining Customs <br />Broker Communication
                </h1>
                <p className="text-linkeblue-100 text-lg mb-8 max-w-lg">
                  LinkeImport connects importers with customs brokers through an intuitive ticket management platform. Create requests, share documents, and communicate all in one place.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-linkeblue-600 hover:bg-linkeblue-50 w-full sm:w-auto">
                      Create Account
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="text-white border-white hover:bg-linkeblue-700 w-full sm:w-auto">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <img 
                  src="https://images.unsplash.com/photo-1565017228812-8c6f067fb93e?auto=format&fit=crop&q=80&w=800&h=600"
                  alt="Cargo containers" 
                  className="rounded-lg shadow-xl max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                LinkeImport offers a comprehensive set of tools to improve collaboration between importers and customs brokers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-linkeblue-100 text-linkeblue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ticket Management</h3>
                <p className="text-gray-600">
                  Create and track import requests with a dedicated ticket system tailored for international trade.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-linkeblue-100 text-linkeblue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Messaging</h3>
                <p className="text-gray-600">
                  Communicate directly with your customs broker through a dedicated chat system for each ticket.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-linkeblue-100 text-linkeblue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Sharing</h3>
                <p className="text-gray-600">
                  Easily attach and share important documents with your customs broker directly within tickets.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-linkeblue-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to streamline your import process?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Join LinkeImport today and experience a more efficient way to collaborate with customs brokers.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-linkeblue-600 hover:bg-linkeblue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-linkeblue-600 font-bold text-xl">LinkeImport</span>
              <p className="text-gray-500 text-sm mt-1">© 2025 All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
