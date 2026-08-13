import type { Metadata } from "next";
import Dashboard from "./dashboard";

export const metadata: Metadata = {
  title: "VaultX Ledger | Digital Asset Operations",
  description: "Secure USDT transaction, client and KYC operations dashboard.",
};

export default function Home() {
  return <Dashboard />;
}
