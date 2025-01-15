import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="flex flex-col border-r border-base-300 w-20 lg:w-72 h-full transition-all duration-200">
      {/* Header */}
      <div className="p-5 border-b border-base-300 w-full">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="lg:block hidden font-medium">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="py-3 w-full overflow-y-auto">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 w-full"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="rounded-full size-12 skeleton" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="lg:block flex-1 hidden min-w-0 text-left">
              <div className="mb-2 w-32 h-4 skeleton" />
              <div className="w-16 h-3 skeleton" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
