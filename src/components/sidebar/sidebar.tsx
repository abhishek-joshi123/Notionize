import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCollaboratingWorkspaces, getFolders, getPrivateWorkSpaces, getSharedWorkspaces, getUserSubscriptionStatus} from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import WorkspaceDropdown from './workspace-dropdown';
import { ScrollArea } from '../ui/scroll-area';
import PlanUsage from './plan-usage';
import NativeNavigation from './native-navigation';
import FoldersDropdownList from './folders-dropdown-list';
import UserCard from './user-card';

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ className, params }) => {
  const supabase = createServerComponentClient({ cookies });

  // Get user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login')

  // Get subscription and folder data and private, collaborating, and shared workspaces concurrently
  const [{ data: subscriptionData, error: subscriptionError }, { data: workspaceFolderData, error: foldersError }, privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] = await Promise.all([getUserSubscriptionStatus(user.id), getFolders(params.workspaceId), getPrivateWorkSpaces(user.id), getCollaboratingWorkspaces(user.id), getSharedWorkspaces(user.id)]);
  if (subscriptionError || foldersError) return redirect('/dashboard');

  return (
    <aside className={twMerge('hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between', className)}>
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          defaultValue={[ ...privateWorkspaces, ...collaboratingWorkspaces, ...sharedWorkspaces].find((workspace) => workspace.id === params.workspaceId)}
        />
        <PlanUsage foldersLength={workspaceFolderData?.length || 0} subscription={subscriptionData} />
        <NativeNavigation myWorkspaceId={params.workspaceId} />
        <ScrollArea className="overflow-scroll relative h-[450px]">
          <div className="pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40" />
          <FoldersDropdownList workspaceFolders={workspaceFolderData || []} workspaceId={params.workspaceId} />
        </ScrollArea>
      </div>
      <UserCard subscription={subscriptionData} />
    </aside>
  );
};

export default Sidebar;
