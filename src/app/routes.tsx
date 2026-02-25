import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/root-layout";
import { DashboardPage } from "./components/dashboard-page";
import { NewsAnnouncementsPage } from "./components/news-announcements-page";
import { CargoWaybillStepper } from "./components/cargo-waybill-stepper";
import { MaintenanceDashboard } from "./components/maintenance-dashboard";
import { FleetScheduleImproved } from "./components/fleet-schedule-improved";
import { ReportsAnalyticsDashboard } from "./components/reports-analytics-dashboard";
import { AccessibilitySettings } from "./components/accessibility-settings";
import { FleetIntercomPage } from "./components/fleet-intercom-page";
import { ProfilePage } from "./components/profile-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "news", Component: NewsAnnouncementsPage },
      { path: "cargo-waybills", Component: CargoWaybillStepper },
      { path: "maintenance", Component: MaintenanceDashboard },
      { path: "fleet-schedule", Component: FleetScheduleImproved },
      { path: "fleet-intercom", Component: FleetIntercomPage },
      { path: "reports", Component: ReportsAnalyticsDashboard },
      { path: "accessibility", Component: AccessibilitySettings },
      { path: "profile", Component: ProfilePage }, // ✅ ADD THIS
    ],
  },
]);