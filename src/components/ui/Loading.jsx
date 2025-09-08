const Loading = () => {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {/* Quick add bar skeleton */}
        <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
        
        {/* Task items skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;