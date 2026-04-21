import {createBrowserRouter} from "react-router";

import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Result from "./features/interview/pages/Result";

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
      {
        path:"/",
        element:<Protected><Home/></Protected>
    },{
        path:"/result",
        element:<Protected><Result/></Protected>
    }
])