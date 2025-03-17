import { useSelector } from "react-redux";

export default function UserList({
  users = [], 
  offlineUsers = [], 
  typingUsers = [],
}) {
  const { user } = useSelector((state) => state.auth);
console.log(offlineUsers,users,"===================================");

  return (
    <div className="w-64 bg-gray-100 border-l overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-black">friends</h2>
      </div>
      <ul>
        {users.length > 0 ? (
          users.map((onlineUser,index) => {
            const isCurrentUser = onlineUser?.id === user?.userId;
            return (
              <li
                key={onlineUser?.id+index}
                className="p-3 border-b flex items-center"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-black">
                  {isCurrentUser
                    ? `${user?.Name} (You)`
                    : onlineUser?.name || "Unknown User"}
                </span>
                {Array.isArray(typingUsers) &&
                  typingUsers.includes(onlineUser?._id) && (
                    <span className="text-xs text-gray-500 ml-2 italic">
                      typing...
                    </span>
                  )}
              </li>
            );
          })
        ) : (
          <li className="p-3 text-gray-500">No users online</li>
        )}
      </ul>

      {offlineUsers.length > 0 && (
        <>
          <div className="p-4 border-b mt-2">
            <h2 className="font-semibold text-black">Offline Users</h2>
          </div>
          <ul>
            {offlineUsers.map((offlineUser) => (
              <li
                key={offlineUser?.id}
                className="p-3 border-b flex items-center"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-gray-600">
                  {offlineUser?.name || "Unknown User"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
