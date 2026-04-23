import Header from "./Header";
import UserProvider from "@/context/UserProvider";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <UserProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-16 pb-16">
          <Outlet />
        </main>
      </div>
    </UserProvider>
  );
}
