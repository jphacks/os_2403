'use client'

import React, { useState } from "react";
import InviteFalse from "./invite-false";
import InviteTrue from "./invite-true";

function Invite({ size = 48 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
        className="inline-block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
      {hovered ?
        <InviteTrue width={size} height={size} />
        :
        <InviteFalse width={size} height={size} />
        }
    </div>
  );
}

export default Invite;