import { v4 as uuidv4 } from "uuid";

// Layouts

// Pages
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Register from "../pages/register/Register";
import NotFound from "../pages/notFound/NotFound";
import Home from "../pages/home/Home";
import { ProtectLayOut } from "../components/Layout";
import PostPage from "../pages/post/PostPage";

// Public routes
const publicRoutes = [
  { path: "/*", component: NotFound, layout: null, key: uuidv4() },
  { path: "/login", component: Login, key: uuidv4(), layout: null },
  {
    path: "/register",
    component: Register,
    key: uuidv4(),
    layout: null,
  },
];

const privateRoutes = [
  { path: "/", component: Home, key: uuidv4(), layout: ProtectLayOut },
  {
    path: "/messenger",
    component: Register,
    key: uuidv4(),
    layout: ProtectLayOut,
  },
  {
    path: "/profile/:id",
    component: Profile,
    key: uuidv4(),
    layout: ProtectLayOut,
  },
  {
    path: "/post/:postId",
    component: PostPage,
    layout: ProtectLayOut,
    key: uuidv4(),
  },
];

export { publicRoutes, privateRoutes };
