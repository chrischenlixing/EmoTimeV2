import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import "bootstrap-4-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


import IndexPage from "./pages/IndexPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import EmployeePage from "./pages/EmployeePage.jsx";
import ManagerPage from "./pages/ManagerPage.jsx";
import "./index.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage></IndexPage>,
  },
  {
    path: "/register",
    element: <RegisterPage></RegisterPage>,
  },
  {
    path: "/employee",
    element: <EmployeePage></EmployeePage>,
  },
  {
    path: "/manager",
    element: <ManagerPage></ManagerPage>,
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


