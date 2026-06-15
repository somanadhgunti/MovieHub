import React from "react";
import { ConfigProvider, theme } from "antd";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          // Use Ant Design v5 Dark Algorithm
          algorithm: theme.darkAlgorithm,
          
          // Seed Tokens for Global Consistent Styling
          token: {
            colorPrimary: "#F84464",      // BookMyShow Brand Red accent
            colorInfo: "#1890ff",         // Info links blue
            colorSuccess: "#52c41a",      // Success indicators green
            colorWarning: "#faad14",      // Warnings yellow
            colorError: "#ff4d4f",        // Error alerts red
            
            colorBgBase: "#141414",       // Deep movie theatre black
            colorBgContainer: "#1f1f1f",  // Elevation card/form dark gray
            colorBorder: "#303030",       // Sleek borders
            
            colorText: "#dfdfdf",         // Secondary details text
            colorTextHeading: "#ffffff",  // Title typography white
            
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            borderRadius: 8,              // Soft rounded edges
          },

          // Component level token overrides for Cards, Buttons, Forms, and Tables
          components: {
            Button: {
              colorPrimary: "#F84464",
              colorPrimaryHover: "#ff5a7e",
              colorPrimaryActive: "#d4304f",
              borderRadius: 6,
              controlHeight: 40,
              fontWeight: 600,
            },
            Card: {
              colorBgContainer: "#1f1f1f",
              colorBorderSecondary: "#303030",
              paddingLG: 24,
            },
            Table: {
              colorBgContainer: "#1f1f1f",
              colorHeaderBg: "#141414",
              colorHeaderColor: "#ffffff",
              colorBorder: "#303030",
              borderRadius: 8,
            },
            Form: {
              labelColor: "#dfdfdf",
              labelFontSize: 14,
            },
            Input: {
              colorBgContainer: "#141414",
              colorBorder: "#303030",
              colorText: "#ffffff",
              colorTextPlaceholder: "#595959",
              borderRadius: 6,
              controlHeight: 40,
            },
            Select: {
              colorBgContainer: "#141414",
              colorBorder: "#303030",
              borderRadius: 6,
              controlHeight: 40,
            },
            Tabs: {
              colorText: "#8c8c8c",
              colorTextActive: "#F84464",
              colorPrimary: "#F84464",
            },
            Collapse: {
              colorBgContainer: "#1f1f1f",
              colorBorder: "#303030",
            }
          },
        }}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;