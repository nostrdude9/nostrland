import { ProfilePage } from "@/components/profile-page"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return <ProfilePage id={params.id} />
}

