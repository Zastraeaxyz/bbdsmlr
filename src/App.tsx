import { Router, Route, Navigate } from '@solidjs/router'
import Login from './pages/Login'
import UserFeed from './pages/UserFeed'
import Post from './pages/Post'

export default function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <Navigate href="/login" />} />
      <Route path="/:user" component={UserFeed} />
      <Route path="/post/:id" component={Post} />
    </Router>
  )
}
