import React, { useState } from "react";
import { sidebarNavItems } from "../../appData/appData";
import Header from "../Header";
import SettingsAssets from "./settingsComponents/assets";
import SettingsHelpDesk from "./settingsComponents/helpDesk";

import "./styles.css";

const Setings: React.FC = () => {
  const [activeSetting, setActiveSetting] = useState<string>(
    sidebarNavItems[0].display
  );

  const renderSettings = () => {
    switch (activeSetting) {
      case sidebarNavItems[2].display:
        return <SettingsAssets />;
      case sidebarNavItems[3].display:
        return <SettingsHelpDesk />;
      default:
        break;
    }
  };

  return (
    <>
      <Header
        headerPath="Dashboard"
        nextPath="> Settings"
        profileVisible={false}
        isNavigate
        isDropIconVisible={false}
      />
      <div className="settings-box">
        <aside className="settings-aside">
          <ul className="settings-sidebar-box">
            {sidebarNavItems.map((eachItem, i) => (
              <li
                onClick={() => setActiveSetting(eachItem.display)}
                key={i}
                className={
                  eachItem.display === activeSetting
                    ? "settings-sidebar-item active-sidebar-item"
                    : "settings-sidebar-item"
                }
              >
                {eachItem.icon} {eachItem.display}
              </li>
            ))}
          </ul>
        </aside>
        <div className="settings-inner-box">{renderSettings()}</div>
      </div>
    </>
  );
};

export default Setings;
