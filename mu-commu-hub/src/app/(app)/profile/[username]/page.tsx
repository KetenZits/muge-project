import { ProfileView } from "@/features/detail-views";
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <ProfileView username={username} />;
}
