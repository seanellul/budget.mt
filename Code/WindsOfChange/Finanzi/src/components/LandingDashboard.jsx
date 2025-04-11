import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { processedBudgetData as budgetData } from '../data/processedBudgetData';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-MT', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Custom tooltip component
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

function LandingDashboard() {
  const { total_revenue, total_expenditure, ministries, revenue_sources } = budgetData;
  const surplus_deficit = total_revenue - total_expenditure;
  const [chartView, setChartView] = useState('ministries');
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    // Trigger chart animations after component mount
    setAnimateCharts(true);
  }, []);

  // --- Prepare data for charts ---

  // Ministry Expenditure Pie Chart Data
  const ministryExpenditureData = ministries.map(ministry => ({
    name: ministry.name,
    value: (ministry.recurrent || 0) + (ministry.capital || 0),
    id: ministry.id
  }));

  // Revenue Sources Pie Chart Data
  const revenueSourcesData = revenue_sources.map(source => ({
    name: source.name,
    value: source.amount
  }));

  // Colors for charts
  const COLORS = [
    '#2563eb', '#059669', '#d97706', '#dc2626', 
    '#7c3aed', '#db2777', '#0891b2', '#4f46e5'
  ];

  // Revenue vs Expenditure Bar Chart Data
  const revenueExpenditureData = [
    {
      name: 'Budget',
      Revenue: total_revenue,
      Expenditure: total_expenditure,
    },
  ];

  return (
    <div className="dashboard-container fade-in">
      {/* Title Section */}
      <div className="card dashboard-header">
        <h2 className="dashboard-title">National Overview {budgetData.year}</h2>
      </div>
      
      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Total Revenue Card */}
        <div className="card kpi-card revenue-card">
          <h3 className="kpi-label">Total Revenue</h3>
          <p className="kpi-value revenue-value">{formatCurrency(total_revenue)}</p>
        </div>

        {/* Total Expenditure Card */}
        <div className="card kpi-card expenditure-card">
          <h3 className="kpi-label">Total Expenditure</h3>
          <p className="kpi-value expenditure-value">{formatCurrency(total_expenditure)}</p>
        </div>

        {/* Surplus/Deficit Card */}
        <div className={`card kpi-card ${surplus_deficit >= 0 ? 'surplus-card' : 'deficit-card'}`}>
          <h3 className="kpi-label">{surplus_deficit >= 0 ? 'Surplus' : 'Deficit'}</h3>
          <p className="kpi-value">{formatCurrency(Math.abs(surplus_deficit))}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="card chart-section">
        {/* Chart Toggle */}
        <div className="chart-controls">
          <div className="toggle-group">
            <button
              className={`toggle-button ${chartView === 'ministries' ? 'active' : ''}`}
              onClick={() => setChartView('ministries')}
            >
              Expenditure by Ministry
            </button>
            <button
              className={`toggle-button ${chartView === 'revenue' ? 'active' : ''}`}
              onClick={() => setChartView('revenue')}
            >
              Revenue Sources
            </button>
          </div>
        </div>

        <div className="charts-grid">
          {/* Pie Chart */}
          <div className="chart-container">
            <h3 className="chart-title">
              {chartView === 'ministries' ? 'Expenditure by Ministry' : 'Revenue Sources'}
            </h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={chartView === 'ministries' ? ministryExpenditureData : revenueSourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={animateCharts ? "80%" : "0%"}
                    innerRadius="30%"
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    animationDuration={1000}
                    animationBegin={0}
                  >
                    {(chartView === 'ministries' ? ministryExpenditureData : revenueSourcesData)
                      .map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="chart-cell"
                        />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Revenue vs. Expenditure</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={revenueExpenditureData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => 
                      value >= 1000000000 
                        ? `€${(value / 1000000000).toFixed(1)}B` 
                        : formatCurrency(value)
                    } 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px' }} />
                  <Bar 
                    dataKey="Revenue" 
                    fill="#059669" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    animationBegin={0}
                  />
                  <Bar 
                    dataKey="Expenditure" 
                    fill="#dc2626" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    animationBegin={500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Tables */}
      <div className="card data-section">
        {chartView === 'ministries' ? (
          <div className="ministry-table">
            <h3 className="table-title">Expenditure by Ministry</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ministry</th>
                    <th>Recurrent</th>
                    <th>Capital</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ministries.map((ministry) => {
                    const total = ministry.recurrent + ministry.capital;
                    const percentage = (total / total_expenditure) * 100;
                    
                    return (
                      <tr key={ministry.id} className="table-row">
                        <td className="ministry-name">{ministry.name}</td>
                        <td className="text-right">{formatCurrency(ministry.recurrent)}</td>
                        <td className="text-right">{formatCurrency(ministry.capital)}</td>
                        <td className="text-right font-medium">
                          {formatCurrency(total)}
                          <span className="percentage">({percentage.toFixed(1)}%)</span>
                        </td>
                        <td className="text-center">
                          <Link 
                            to={`/ministry/${ministry.id}`}
                            className="btn btn-primary"
                          >
                            Details
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="revenue-table">
            <h3 className="table-title">Revenue Sources</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Amount</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue_sources.map((source, index) => {
                    const percentage = (source.amount / total_revenue) * 100;
                    
                    return (
                      <tr key={index} className="table-row">
                        <td className="source-name">
                          <div className="source-indicator">
                            <span 
                              className="color-dot"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></span>
                            <span>{source.name}</span>
                          </div>
                        </td>
                        <td className="text-right">{formatCurrency(source.amount)}</td>
                        <td className="text-right">{percentage.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingDashboard; 