import React from 'react';
import Calculator from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="https://www.givewise.ca/">
              <img src="/givewise-logo.png" alt="GiveWise" className="h-20" />
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="https://fund.givewise.ca/login" className="px-5 py-2.5 text-sm font-bold text-givewise-blue border border-givewise-blue rounded-full hover:bg-blue-50 transition-colors text-center inline-block">
              Log In
            </a>
            <a href="https://fund.givewise.ca/sign-up/signup" className="px-5 py-2.5 text-sm font-bold text-white bg-givewise-gold rounded-full hover:bg-yellow-500 shadow-md transition-all hover:shadow-lg text-center inline-block">
              Sign Up
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Giving Made <span className="text-givewise-blue">Smarter</span>.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Calculate your impact and see how much you can save by donating securities instead of cash.
            </p>

            <Calculator />

            <p className="mt-8 text-sm text-gray-400 max-w-2xl mx-auto">
              Calculations in this table are estimates based on prior-year federal and provincial tax rates and the information provided. Actual tax outcomes may vary. Please consult with your financial advisor or tax professional for guidance specific to your situation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <img src="/givewise-logo.png" alt="GiveWise" className="h-16 opacity-50" />
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} GiveWise Foundation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
