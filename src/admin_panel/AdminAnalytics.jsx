import React, { useEffect, useState } from 'react';
import api from '../api/api';

function AdminAnalytics() {
  const [stats, setStats] = useState({});
  const [lowStock, setLowStock] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    try {
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);

      const stockRes = await api.get('/api/admin/low-stock');
      setLowStock(stockRes.data);

      const ordersRes = await api.get('/api/admin/recent-orders');
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg">Orders Today</h2>
          <p className="text-3xl font-bold">{stats.totalOrdersToday}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg">Sales Today</h2>
          <p className="text-3xl font-bold">₹{stats.totalSalesToday}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg">Top Product</h2>
          <p className="text-xl">{stats.topProduct}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-2">Low Stock Products</h2>
      <ul className="mb-6">
        {lowStock.map((p) => (
          <li key={p.productId} className="flex justify-between border-b py-2">
            <span>{p.productName}</span>
            <span className="text-red-600">{p.quantity}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-2">Recent Orders</h2>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId}>
              <td className="border p-2">{o.orderId}</td>
              <td className="border p-2">{o.email}</td>
              <td className="border p-2">{o.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAnalytics;
