import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./Tabs.css";
import { styled } from "@mui/material/styles";
const CustomTabPanel = styled(TabPanel)({
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});
const CustomTab = styled(Tab)({
    textTransform: 'none',
    fontSize: 12,
    height: '35px'
})
export default function TabsComponent({ tabs = [] }) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="esfiddle-tabs-container">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit"
              indicatorColor="primary"
              aria-label="secondary tabs example"
            >
              {tabs.map(({ name, component, componentProps }, index) => {
                return <CustomTab value={index} label={name}></CustomTab>;
              })}
            </Tabs>
          </Box>
          {tabs.map(
            ({ component: TabPanelComponent, componentProps }, index) => {
              return (
                <CustomTabPanel value={index}>
                  <TabPanelComponent {...{ ...componentProps }} />
                </CustomTabPanel>
              );
            }
          )}
        </TabContext>
      </Box>
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      component: PropTypes.elementType.isRequired,
    }).isRequired
  ),
};
