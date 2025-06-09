
import { useState, useEffect } from 'react';

export const useSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const expandSidebar = () => {
    setIsCollapsed(false);
  };

  const collapseSidebar = () => {
    setIsCollapsed(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Show expanded state when hovered over collapsed sidebar
  const isExpanded = !isCollapsed || isHovered;

  return {
    isCollapsed,
    isExpanded,
    isHovered,
    toggleSidebar,
    expandSidebar,
    collapseSidebar,
    handleMouseEnter,
    handleMouseLeave
  };
};
