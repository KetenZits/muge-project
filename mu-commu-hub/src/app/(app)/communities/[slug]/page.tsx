import { CommunityDetailView } from "@/features/detail-views";
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <CommunityDetailView slug={slug}/>}
