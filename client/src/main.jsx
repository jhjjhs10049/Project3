import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import root from "./router/root";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={root}></RouterProvider>
);
