import { getPosts } from '../data/posts';
import DashboardClient from './DashboardClient';

export default async function Dashboard() {
  const posts = await getPosts();
  return <DashboardClient posts={posts} />;
}
