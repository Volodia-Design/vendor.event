import DashboardIcon from "../Images/SidebarIcons/Home.svg";
import DashboardIconActive from "../Images/SidebarIcons/HomeActive.svg";
import HistoryIcon from "../Images/SidebarIcons/History.svg";
import HistoryIconActive from "../Images/SidebarIcons/HistoryActive.svg";
import TimelineIcon from "../Images/SidebarIcons/Timeline.svg";
import TimelineIconActive from "../Images/SidebarIcons/TimelineActive.svg";
import SettingsIcon from "../Images/SidebarIcons/Settings.svg";
import SettingsIconActive from "../Images/SidebarIcons/SettingsActive.svg";
import GalleryIcon from "../Images/SidebarIcons/Gallery.svg";
import GalleryIconActive from "../Images/SidebarIcons/GalleryActive.svg";

const sidebarItems = [
    {
        name: "Dashboard",
        path: "/",
        icon: DashboardIcon,
        activeIcon: DashboardIconActive
    },
    {
        name: "History",
        path: "/history",
        icon: HistoryIcon,
        activeIcon: HistoryIconActive
    },
    {
        name: "Timeline & Milestones",
        path: "/timeline",
        icon: TimelineIcon,
        activeIcon: TimelineIconActive
    },
    {
        name: "Settings",
        path: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIconActive
    },
    {
        name: "Gallery",
        path: "/gallery",
        icon: GalleryIcon,
        activeIcon: GalleryIconActive
    }
];

export default sidebarItems;
