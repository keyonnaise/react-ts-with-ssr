import HomePage from "./home";
import AboutPage from "./about";
import DetailPage from "./detail";
import { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/detail",
    element: <DetailPage />,
  },
];

export default routes;
