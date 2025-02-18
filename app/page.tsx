import { HomeView } from "@/components/home-view"
import { GlobalNavbar } from "@/components/global-navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar />
      <main className="pt-16">
        <HomeView />
      </main>
    </div>
  )
}

