"use client";

import { Mail, MailOpen } from "lucide-react";
import React, { useState } from "react";

interface MailIconProps {
  count: number;
  size?: number;
}

export const MailIcon = (p: MailIconProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      <div
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered ? (
          <MailOpen size={p.size} color="#333333" />
        ) : (
          <Mail size={p.size} color="#333333" />
        )}
        {p.count > 0 && (
          <div
            style={{
              position: "absolute",
              top: -9,
              right: -9,
              backgroundColor: "#E74C3C",
              color: "white",
              borderRadius: "50%",
              padding: "2px",
              fontSize: "12px",
              minWidth: "20px",
              textAlign: "center",
            }}
          >
            {p.count >= 100 ? "99+" : p.count}
          </div>
        )}
      </div>
    </div>
  );
};
