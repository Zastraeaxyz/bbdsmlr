import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { AuthProvider } from "~/lib/useAuth";
import "./index.css";

export default function App() {
  return (
    <Router
      root={props => (
        <AuthProvider>
          <MetaProvider>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        </AuthProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
