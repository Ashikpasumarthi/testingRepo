
// import { BrowserRouter } from 'react-router-dom';
// import './App.css';
// import RegisterPage from './FrontEndPages/RegisterPage';

// function App() {
//   return (
//   <BrowserRouter>
//     <RegisterPage/>
//     </BrowserRouter>
//   );
// }

// export default App;


import * as React from "react";
// import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  // Link,
} from "react-router-dom";
import RegisterPage from "./FrontEndPages/RegisterPage";
import Login from "./FrontEndPages/Login";
// import Single from "./pages/Single";
// import Write from "./pages/Write";
// import Layout from "./pages/layout";
import Home from "./FrontEndPages/Home";
// import "./styles.scss";


const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Layout />,
  //   children: [
  //     {
  //       path: "/home",
  //       element: <Home />,
  //     },
  //     {
  //       path: "/post/:postId",
  //       element: <Single />,
  //     },
  //     {
  //       path: "/write",
  //       element: <Write />,
  //     },
  //   ],
  // },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Home",
    element: <Home />,
  },

]);

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={ router } />
    </div>
  );
};



export default App;