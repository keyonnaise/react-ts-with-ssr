import { Link, useRoutes } from "react-router-dom";
import routes from "./pages/routes";

function App() {
  const element = useRoutes(routes);

  return (
    <>
      <div>
        <Link to="./">HOME</Link>
        <Link to="./about">ABOUT</Link>
        <Link to="./detail">DETAIL</Link>
      </div>
      <hr />
      <div>{element}</div>
    </>
  );
}

export default App;
