import React from "react";
import ChartPie from "../components/ChartPie";
import ChartLine from "../components/ChartLine";

const styles = {
  marginTop: "50px"
};

class DashboardChart extends React.Component {
  render() {
    return (
      <div style={styles}>
        <ChartLine />
        <ChartPie />
      </div>
    );
  }
}

export default DashboardChart;
