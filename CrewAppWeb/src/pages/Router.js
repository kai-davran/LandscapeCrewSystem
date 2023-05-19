import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import WithBgSpinner from "../components/spinners/WithBgSpinner";
import PrivateRoute from "../components/PrivateRoute"; 

// Lazy-loaded pages
const LoginPage = lazy(() => import("./auth/LoginPage"));
const MainScheduling = lazy(() => import("./job/MainScheduling"));
const ManageCustomers = lazy(() => import("./manage/ManageCustomers"));
const ManageCrew = lazy(() => import("./manage/ManageCrew"));
const ManageCrewMembers = lazy(() => import("./manage/ManageCrewMembers"));
const Reports = lazy(() => import("./reports/Reports")); 
const Billing = lazy(() => import("./billing/Billing"));
const CreateOneTimeJob = lazy(() => import("../components/jobs/CreateOneTimeJob"));
const ListProposal = lazy(() => import("./proposal/ListProposal"));

export default function Router() {
  return (
    <Suspense fallback={<WithBgSpinner />}>
      <Routes>

        {/* Redirect root "/" to mainscheduling */}
        <Route path="/" element={<Navigate to="/mainscheduling" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        {[
          { path: "/mainscheduling", element: <MainScheduling /> },
          { path: "/manage-customers", element: <ManageCustomers /> },
          { path: "/manage-crew", element: <ManageCrew /> },
          { path: "/manage-crew-members", element: <ManageCrewMembers /> },
          { path: "/reports", element: <Reports /> },
          { path: "/proposal", element: <ListProposal /> },
          { path: "/billing", element: <Billing /> },
          { path: "/create-one-time-job", element: <CreateOneTimeJob /> }
        ].map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
          />
        ))}

        {/* Catch-all route (optional) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}
