import React from "react";
import CharBar from "../components/ChartBar";
import ChartLine from "../components/ChartLine";

const styles = {
  marginTop: "50px"
};

class DashboardChart extends React.Component {
  render() {
    return (
      <div style={styles}>
        <ChartLine />
        <CharBar />
      </div>
    );
  }
}

export default DashboardChart;
