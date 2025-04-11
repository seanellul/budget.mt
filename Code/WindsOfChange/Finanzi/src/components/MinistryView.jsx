import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { processedBudgetData as budgetData } from '../data/processedBudgetData';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-MT', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
};

const MinistryView = () => {
  const { ministryId } = useParams();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [ministry, setMinistry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when ministryId changes
    setMinistry(null);
    setError(null);
    setLoadingProgress(0);

    // Find ministry with flexible ID matching
    const foundMinistry = budgetData.ministries.find(m => 
      String(m.id) === String(ministryId) || 
      m.name.toLowerCase().replace(/\s+/g, '-') === ministryId.toLowerCase()
    );

    if (foundMinistry) {
      setMinistry(foundMinistry);
    } else {
      setError('Ministry not found');
    }

    // Simulate loading progress
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [ministryId]);

  if (error) {
    return (
      <div className="ministry-error fade-in">
        <h1 className="error-title">Ministry not found</h1>
        <p className="error-message">The ministry you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Return to Dashboard</Link>
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="ministry-loading fade-in">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-stats"></div>
          <div className="skeleton-charts"></div>
        </div>
      </div>
    );
  }

  // Handle both old and new data structures
  let totalBudget, recurrentTotal, capitalTotal, barData;
  
  if (ministry.votes) {
    // Old structure with votes array
    recurrentTotal = ministry.votes.reduce((acc, vote) => acc + vote.recurrent, 0);
    capitalTotal = ministry.votes.reduce((acc, vote) => acc + vote.capital, 0);
    totalBudget = recurrentTotal + capitalTotal;
    barData = ministry.votes.map(vote => ({
      name: vote.name,
      recurrent: vote.recurrent,
      capital: vote.capital
    }));
  } else {
    // New structure with recurrentExpenditure and capitalExpenditure
    totalBudget = ministry.totalExpenditure || 0;
    recurrentTotal = ministry.recurrentExpenditure?.total || 0;
    capitalTotal = ministry.capitalExpenditure || 0;
    barData = [{
      name: ministry.name,
      recurrent: recurrentTotal,
      capital: capitalTotal
    }];
  }

  const pieData = [
    { name: 'Recurrent', value: recurrentTotal },
    { name: 'Capital', value: capitalTotal }
  ];

  const COLORS = ['#60a5fa', '#34d399'];

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
    <div className="ministry-view fade-in">
      {/* Progress Bar */}
      <div 
        className="progress-bar" 
        style={{ 
          transform: `scaleX(${loadingProgress / 100})`,
          opacity: loadingProgress === 100 ? 0 : 1,
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
        }} 
      />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Dashboard</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{ministry.name}</span>
      </div>

      {/* Ministry Header */}
      <div className="ministry-header">
        <h1 className="ministry-title">{ministry.name}</h1>
        
        <div className="ministry-stats">
          <div className="ministry-stat-card">
            <div className="ministry-stat-label">Total Budget</div>
            <div className="ministry-stat-value">{formatCurrency(totalBudget)}</div>
          </div>
          <div className="ministry-stat-card">
            <div className="ministry-stat-label">Recurrent Expenditure</div>
            <div className="ministry-stat-value">{formatCurrency(recurrentTotal)}</div>
          </div>
          <div className="ministry-stat-card">
            <div className="ministry-stat-label">Capital Expenditure</div>
            <div className="ministry-stat-value">{formatCurrency(capitalTotal)}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="ministry-chart-grid">
        <div className="ministry-chart-card">
          <h2 className="ministry-chart-title">Budget Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={450}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }}
                animationBegin={0}
                animationDuration={1500}
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

        <div className="ministry-chart-card">
          <h2 className="ministry-chart-title">Vote Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--text-secondary)' }}
                tickLine={{ stroke: 'var(--border-color)' }}
                axisLine={{ stroke: 'var(--border-color)' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                tick={{ fill: 'var(--text-secondary)' }}
                tickLine={{ stroke: 'var(--border-color)' }}
                axisLine={{ stroke: 'var(--border-color)' }}
                tickFormatter={(value) => `€${value / 1000000}M`}
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
                dataKey="recurrent" 
                fill={COLORS[0]} 
                stackId="a"
                animationBegin={0}
                animationDuration={1500}
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="capital" 
                fill={COLORS[1]} 
                stackId="a"
                animationBegin={0}
                animationDuration={1500}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Votes Table */}
      {ministry.votes ? (
        <div className="table-container">
          <h2 className="table-title">Votes Breakdown</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Vote</th>
                <th>Recurrent</th>
                <th>Capital</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ministry.votes.map((vote) => (
                <tr key={vote.name}>
                  <td className="ministry-name">{vote.name}</td>
                  <td>{formatCurrency(vote.recurrent)}</td>
                  <td>{formatCurrency(vote.capital)}</td>
                  <td>{formatCurrency(vote.recurrent + vote.capital)}</td>
                  <td>
                    <Link 
                      to={`/ministry/${ministryId}/vote/${encodeURIComponent(vote.name)}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <h2 className="table-title">Budget Breakdown</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {ministry.recurrentExpenditure && Object.entries(ministry.recurrentExpenditure)
                .filter(([key]) => key !== 'total')
                .map(([key, value]) => (
                  <tr key={key}>
                    <td className="ministry-name">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </td>
                    <td>{formatCurrency(value)}</td>
                    <td>{((value / recurrentTotal) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              <tr className="subtotal-row">
                <td><strong>Total Recurrent</strong></td>
                <td><strong>{formatCurrency(recurrentTotal)}</strong></td>
                <td><strong>{((recurrentTotal / totalBudget) * 100).toFixed(1)}%</strong></td>
              </tr>
              <tr>
                <td className="ministry-name">Capital Expenditure</td>
                <td>{formatCurrency(capitalTotal)}</td>
                <td>{((capitalTotal / totalBudget) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="total-row">
                <td><strong>Total Budget</strong></td>
                <td><strong>{formatCurrency(totalBudget)}</strong></td>
                <td><strong>100%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MinistryView; 