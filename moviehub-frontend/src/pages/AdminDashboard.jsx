import React, { useEffect, useState } from "react";
import { Typography, Table, Card, Tag, Alert, Empty } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";
import { formatCurrency, formatDate, formatTime } from "../utils/dateUtils";
import { getBookingById, resolveBookings } from "../services/bookingService";
import { getAllMovies } from "../services/movieService";

const { Title } = Typography;

export const AdminDashboard = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [activeMoviesCount, setActiveMoviesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch active movies count from backend
        let moviesList = [];
        try {
          moviesList = await getAllMovies();
        } catch (movieErr) {
          console.error("Failed to load movies for admin panel:", movieErr);
        }
        setActiveMoviesCount(moviesList?.length || 0);

        // 2. Scan IDs 1 to 50 in parallel to gather recent transactions from backend
        const scanIds = Array.from({ length: 50 }, (_, i) => i + 1);
        const bookingPromises = scanIds.map(async (id) => {
          try {
            return await getBookingById(id);
          } catch (err) {
            return null;
          }
        });

        const fetchedBookings = (await Promise.all(bookingPromises)).filter(Boolean);
        const resolvedBookings = await resolveBookings(fetchedBookings);
        setRecentBookings(resolvedBookings);
      } catch (err) {
        console.error("Failed to scan bookings:", err);
        setError("Failed to query transaction log registers from the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const columns = [
    {
      title: "Booking Ref",
      dataIndex: "bookingNumber",
      key: "bookingNumber",
      render: (text) => <span style={{ fontFamily: "monospace", color: "#fff" }}>{text}</span>
    },
    {
      title: "Movie Title",
      dataIndex: "movieTitle",
      key: "movieTitle",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>
    },
    {
      title: "Cinema Screen",
      dataIndex: "theatreName",
      key: "theatreName",
      render: (text, record) => <span>{text} | Screen {record.screenNumber || 1}</span>
    },
    {
      title: "Seats Count",
      dataIndex: "totalSeats",
      key: "totalSeats",
      align: "center"
    },
    {
      title: "Amount Paid",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val) => <span style={{ color: "#52c41a", fontWeight: "bold" }}>{formatCurrency(val)}</span>
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => (
        <Tag color={status === "CONFIRMED" ? "green" : "red"}>
          {status}
        </Tag>
      )
    },
    {
      title: "Show Time",
      dataIndex: "showDate",
      key: "showDate",
      render: (date, record) => <span>{formatDate(date)} {formatTime(record.showTime)}</span>
    }
  ];

  // Dynamically calculate metrics from real backend responses
  const totalRevenue = recentBookings
    .filter(b => b.bookingStatus === "CONFIRMED")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const statsData = {
    totalRevenue: totalRevenue,
    totalBookings: recentBookings.length,
    activeSeatLocks: 0,
    activeMovies: activeMoviesCount
  };

  if (error) {
    return (
      <div style={{ color: "#ffffff", padding: "20px" }}>
        <Alert message="Connection Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ color: "#ffffff" }}>
      
      <Title level={2} style={{ color: "#ffffff", marginBottom: "25px", fontWeight: "bold" }}>
        Admin Dashboard Overview
      </Title>

      {/* Analytics Widget section */}
      <AnalyticsDashboard data={statsData} />

      {/* Recent Activity Table section */}
      <Card
        title={<span style={{ color: "#fff" }}>LATEST TRANSACTIONS</span>}
        style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", marginTop: "30px", borderRadius: "8px" }}
      >
        {recentBookings.length === 0 && !loading ? (
          <Empty description="No transaction bookings records found." image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Table
            columns={columns}
            dataSource={recentBookings}
            rowKey="bookingId"
            loading={loading ? { indicator: <LoadingOutlined style={{ fontSize: 24, color: "#F84464" }} /> } : false}
            pagination={false}
            scroll={{ x: 700 }}
            className="dark-table"
          />
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
