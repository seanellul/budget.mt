import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { processedBudgetData as budgetData } from '../data/processedBudgetData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-MT', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
};

function VoteDetailView() {
  const { ministryId, voteName } = useParams();
  
  // Find the ministry and vote data
  const ministry = budgetData.ministries.find(m => m.id === parseInt(ministryId, 10));
  
  if (!ministry) {
    return (
      <div className="ministry-error fade-in">
        <h1 className="error-title">Ministry not found</h1>
        <p className="error-message">The ministry you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Return to Dashboard</Link>
      </div>
    );
  }
  
  // Find the vote by name (URL-decoded)
  const decodedVoteName = decodeURIComponent(voteName);
  const vote = ministry.votes.find(v => v.name === decodedVoteName);
  
  if (!vote) {
    return (
      <div className="ministry-error fade-in">
        <h1 className="error-title">Vote not found</h1>
        <p className="error-message">The vote you're looking for doesn't exist or has been moved.</p>
        <Link to={`/ministry/${ministryId}`} className="btn btn-primary">
          Back to {ministry.name}
        </Link>
      </div>
    );
  }
  
  // Calculate total budget for this vote
  const totalVoteBudget = (vote.recurrent || 0) + (vote.capital || 0);
  
  // Mock historical data (in a real app, this would come from the API)
  const historicalData = [
    {
      year: '2023',
      Recurrent: vote.recurrent * 0.9, // Mock data - 10% less than current
      Capital: vote.capital * 0.85,    // Mock data - 15% less than current
    },
    {
      year: '2024',
      Recurrent: vote.recurrent * 0.95, // Mock data - 5% less than current
      Capital: vote.capital * 0.9,     // Mock data - 10% less than current
    },
    {
      year: '2025',
      Recurrent: vote.recurrent,
      Capital: vote.capital,
    }
  ];
  
  // Prepare category data for charts
  const categoryChartData = vote.categories ? vote.categories.map(cat => ({
    name: cat.name,
    amount: cat.amount
  })) : [];
  
  // For pie chart
  const pieData = vote.categories ? vote.categories.map(cat => ({
    name: cat.name,
    value: cat.amount
  })) : [];
  
  // Colors for charts
  const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#ec4899'];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="vote-view fade-in">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Dashboard</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={`/ministry/${ministryId}`} className="breadcrumb-link">{ministry.name}</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{vote.name}</span>
      </div>
    
      {/* Vote Header */}
      <div className="vote-header">
        <h1 className="vote-title">{vote.name}</h1>
        <p className="vote-description">Vote under {ministry.name}</p>
        
        <div className="vote-stats">
          <div className="vote-stat-card">
            <div className="vote-stat-label">Total Budget</div>
            <div className="vote-stat-value">{formatCurrency(totalVoteBudget)}</div>
          </div>
          
          <div className="vote-stat-card">
            <div className="vote-stat-label">Recurrent Expenditure</div>
            <div className="vote-stat-value">{formatCurrency(vote.recurrent || 0)}</div>
            <div className="vote-stat-percentage">
              {((vote.recurrent || 0) / totalVoteBudget * 100).toFixed(1)}% of total
            </div>
          </div>
          
          <div className="vote-stat-card">
            <div className="vote-stat-label">Capital Expenditure</div>
            <div className="vote-stat-value">{formatCurrency(vote.capital || 0)}</div>
            <div className="vote-stat-percentage">
              {((vote.capital || 0) / totalVoteBudget * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="ministry-chart-grid">
        {/* Historical Comparison Chart */}
        <div className="ministry-chart-card">
          <h2 className="ministry-chart-title">Budget History (2023-2025)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={historicalData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" strokeOpacity={0.2} />
              <XAxis 
                dataKey="year"
                tick={{ fill: 'var(--text-secondary)' }}
                tickLine={{ stroke: 'var(--border-color)' }}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--text-secondary)' }}
                tickLine={{ stroke: 'var(--border-color)' }}
                axisLine={{ stroke: 'var(--border-color)' }}
                tickFormatter={(value) => 
                  value >= 1000000 
                    ? `€${(value / 1000000).toFixed(1)}M` 
                    : formatCurrency(value)
                } 
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'var(--background-light)', opacity: 0.2 }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => <span style={{ color: 'var(--text-primary)' }}>{value}</span>}
              />
              <Bar 
                dataKey="Recurrent" 
                name="Recurrent Expenditure"
                fill={COLORS[0]} 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Capital" 
                name="Capital Expenditure"
                fill={COLORS[1]} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Category Distribution Chart (if categories exist) */}
        {vote.categories && vote.categories.length > 0 && (
          <div className="ministry-chart-card">
            <h2 className="ministry-chart-title">Budget by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }}
                  outerRadius={80}
                  innerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="var(--background-card)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'var(--background-light)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span style={{ color: 'var(--text-primary)' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      {/* Detailed Categories Table */}
      {vote.categories && vote.categories.length > 0 && (
        <div className="table-container">
          <h2 className="table-title">Expense Categories</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>% of Vote</th>
              </tr>
            </thead>
            <tbody>
              {vote.categories.map((category, index) => {
                const percentage = (category.amount / totalVoteBudget) * 100;
                
                return (
                  <tr key={index}>
                    <td>
                      <div className="category-name">
                        <span 
                          className="color-dot"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        {category.name}
                      </div>
                    </td>
                    <td>{formatCurrency(category.amount)}</td>
                    <td>{percentage.toFixed(1)}%</td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td>Total</td>
                <td>{formatCurrency(
                  vote.categories.reduce((sum, cat) => sum + cat.amount, 0)
                )}</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VoteDetailView; 