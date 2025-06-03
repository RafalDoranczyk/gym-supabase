"use client";

import { useState } from "react";

export function useMeasurementsUI() {
  const [drawer, setDrawer] = useState({ isOpen: false });

  const openDrawer = () => {
    setDrawer({ isOpen: true });
  };

  const closeDrawer = () => {
    setDrawer({ isOpen: false });
  };

  return {
    drawer,
    openDrawer,
    closeDrawer,
  };
}
