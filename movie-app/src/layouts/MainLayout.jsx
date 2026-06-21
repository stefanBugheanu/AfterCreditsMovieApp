import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import HomePage from "../pages/HomePage";
import { useState } from "react";
export default function MainLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col     
     bg-[#050505]
       bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,212,255,0.12),transparent_30%)]"
    >
      <NavBar />

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
