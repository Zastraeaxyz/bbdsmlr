import { Router, Route } from '@solidjs/router'
import Login from './pages/Login'
import Home from './pages/Home'

export default function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
    </Router>
  )
}
