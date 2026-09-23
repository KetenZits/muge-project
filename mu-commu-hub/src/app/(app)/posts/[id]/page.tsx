import { PostDetailView } from "@/features/detail-views";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <PostDetailView id={id}/>}
