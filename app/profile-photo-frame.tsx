"use client";

import type { ReactNode } from "react";

export function ProfilePhotoFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="about-photo-frame"
      onContextMenu={event => event.preventDefault()}
      onDragStart={event => event.preventDefault()}
    >
      {children}
    </div>
  );
}
