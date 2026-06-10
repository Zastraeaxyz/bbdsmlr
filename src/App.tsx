import { Router, Route, Navigate } from "@solidjs/router";
import Login from "./pages/Login";
import UserFeed from "./pages/UserFeed";
import Post from "./pages/Post";
import FollowingFeed from "./pages/FollowingFeed";
import { getCurrentUser, setCurrentUser } from "./lib/api";

function Home() {
  let user = getCurrentUser();
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {}
    if (user) setCurrentUser(user);
  }
  if (!user) return <Navigate href="/login" />;
  return <FollowingFeed />;
}

export default function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/:user" component={UserFeed} />
      <Route path="/post/:id" component={Post} />
    </Router>
  );
}
