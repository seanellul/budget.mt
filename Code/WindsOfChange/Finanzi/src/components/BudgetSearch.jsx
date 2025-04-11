import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { processedBudgetData as budgetData } from '../data/processedBudgetData';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-MT', { style: 'currency', currency: 'EUR' }).format(amount);
};

function BudgetSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    const term = searchQuery.toLowerCase().trim();
    
    if (!term) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    // Search through ministries, votes, and categories
    const results = [];
    
    // Search ministries
    budgetData.ministries.forEach(ministry => {
      // Check ministry name
      if (ministry.name.toLowerCase().includes(term)) {
        results.push({
          type: 'ministry',
          name: ministry.name,
          amount: ministry.recurrent + ministry.capital,
          ministryId: ministry.id,
          matchedOn: 'Ministry name'
        });
      }
      
      // Check votes
      ministry.votes.forEach(vote => {
        if (vote.name.toLowerCase().includes(term)) {
          results.push({
            type: 'vote',
            name: vote.name,
            amount: (vote.recurrent || 0) + (vote.capital || 0),
            ministryId: ministry.id,
            ministryName: ministry.name,
            voteName: vote.name,
            matchedOn: 'Vote name'
          });
        }
        
        // Check categories
        if (vote.categories) {
          vote.categories.forEach(category => {
            if (category.name.toLowerCase().includes(term)) {
              results.push({
                type: 'category',
                name: category.name,
                amount: category.amount,
                ministryId: ministry.id,
                ministryName: ministry.name,
                voteName: vote.name,
                matchedOn: 'Category name'
              });
            }
          });
        }
      });
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <div className="search-container fade-in">
      <div className="search-header">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Dashboard</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Budget Search</span>
        </div>
        <h1 className="search-title">Budget Search</h1>
        <p className="search-description">
          Search through ministry budgets, votes, and categories to find detailed information about Malta's 2025 budget allocation.
        </p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="e.g. Education, Infrastructure, Emoluments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search budget items"
        />
        <button type="submit" className="search-button" aria-label="Search">
          <svg 
            className="search-icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </form>

      <div className="search-tips">
        <h2 className="search-tips-title">Search Tips</h2>
        <ul className="search-tips-list">
          <li className="search-tip-item">
            <svg 
              className="search-tip-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
            <span>Search by ministry name (e.g., "Education", "Health")</span>
          </li>
          <li className="search-tip-item">
            <svg 
              className="search-tip-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
              />
            </svg>
            <span>Search by vote name (e.g., "Research", "Infrastructure")</span>
          </li>
          <li className="search-tip-item">
            <svg 
              className="search-tip-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
              />
            </svg>
            <span>Search by category (e.g., "Emoluments", "Programmes")</span>
          </li>
          <li className="search-tip-item">
            <svg 
              className="search-tip-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
            <span>Try both full and partial terms for better results</span>
          </li>
        </ul>
      </div>

      {/* Search results will be added here */}
      {searchQuery && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            <div className="bg-white shadow-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Search Results ({searchResults.length})</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 text-left bg-gray-50 text-gray-600 text-sm font-medium uppercase tracking-wider border-b">Name</th>
                      <th className="py-3 px-6 text-left bg-gray-50 text-gray-600 text-sm font-medium uppercase tracking-wider border-b">Type</th>
                      <th className="py-3 px-6 text-left bg-gray-50 text-gray-600 text-sm font-medium uppercase tracking-wider border-b">Location</th>
                      <th className="py-3 px-6 text-right bg-gray-50 text-gray-600 text-sm font-medium uppercase tracking-wider border-b">Amount</th>
                      <th className="py-3 px-6 text-center bg-gray-50 text-gray-600 text-sm font-medium uppercase tracking-wider border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {searchResults.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium text-gray-800">{result.name}</td>
                        <td className="py-4 px-6 text-sm">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                            result.type === 'ministry' 
                              ? 'bg-blue-100 text-blue-800' 
                              : result.type === 'vote'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                          }`}>
                            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {result.type === 'ministry' 
                            ? result.name
                            : result.type === 'vote'
                              ? result.ministryName
                              : `${result.ministryName} / ${result.voteName}`
                          }
                        </td>
                        <td className="py-4 px-6 text-sm text-right font-medium text-gray-800">{formatCurrency(result.amount)}</td>
                        <td className="py-4 px-6 text-sm text-center">
                          {result.type === 'ministry' && (
                            <Link 
                              to={`/ministry/${result.ministryId}`}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <span>View Details</span>
                              <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          )}
                          {result.type === 'vote' && (
                            <Link 
                              to={`/ministry/${result.ministryId}/vote/${encodeURIComponent(result.voteName)}`}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <span>View Details</span>
                              <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          )}
                          {result.type === 'category' && (
                            <Link 
                              to={`/ministry/${result.ministryId}/vote/${encodeURIComponent(result.voteName)}`}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <span>View Vote</span>
                              <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-xl p-12 text-center">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No results found for "{searchQuery}". Please try a different search term or check your spelling.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BudgetSearch; 