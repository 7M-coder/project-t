import React from "react";
import { Flex, Spin } from "antd";

/**
 * A loading spinner component that displays a centered spinning animation
 * Always centers in the middle of its container, taking full width and height
 * @returns {JSX.Element} A flex container with a large spinning animation centered on the page
 */
const LoadingSpinner: React.FC = () => (
  <Flex
    align="center"
    justify="center"
    style={{
      width: "100%",
      height: "100%",
      minHeight: "300px",
    }}
  >
    <Spin size="large" />
  </Flex>
);

export default LoadingSpinner;
