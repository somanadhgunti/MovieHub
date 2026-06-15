import React from "react";
import { notification } from "antd";

notification.config({
  placement: "topRight",
  duration: 4.5,
});

export const showNotification = (type, message, description = "") => {
  notification[type]({
    message: React.createElement("span", { style: { color: "#ffffff", fontWeight: "bold" } }, message),
    description: React.createElement("span", { style: { color: "#dfdfdf" } }, description),
    style: {
      backgroundColor: "#1f1f1f",
      border: "1px solid #303030",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
    },
  });
};

export const notificationService = {
  success: (msg, desc = "") => showNotification("success", msg, desc),
  error: (msg, desc = "") => showNotification("error", msg, desc),
  info: (msg, desc = "") => showNotification("info", msg, desc),
  warning: (msg, desc = "") => showNotification("warning", msg, desc),
};

export default notificationService;
