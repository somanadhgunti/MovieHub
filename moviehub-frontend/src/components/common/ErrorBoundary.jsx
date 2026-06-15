import React, { Component } from "react";
import { Result, Button } from "antd";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#141414" }}>
          <Result
            status="500"
            title="Something went wrong"
            subTitle="We apologize for the inconvenience. Please try reloading the page."
            extra={
              <Button type="primary" onClick={this.handleReload} style={{ backgroundColor: "#F84464", borderColor: "#F84464" }}>
                Reload Page
              </Button>
            }
            style={{ color: "#ffffff" }}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
