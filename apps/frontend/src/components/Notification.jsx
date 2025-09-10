const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-l-green-500',
          textColor: 'text-green-700',
          icon: '✓'
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-l-blue-500',
          textColor: 'text-blue-700',
          icon: 'i'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-l-yellow-500',
          textColor: 'text-yellow-700',
          icon: '⚠'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-l-red-500',
          textColor: 'text-red-700',
          icon: '✕'
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-l-blue-500',
          textColor: 'text-blue-700',
          icon: 'i'
        };
    }
  };

  const style = getNotificationStyle(notification.type);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${style.bgColor} ${style.borderColor} border-l-4 p-4 rounded-r shadow-md max-w-md`}>
        <div className="flex items-start">
          <div className={`${style.textColor} flex-shrink-0 mr-3`}>
            <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-white text-xs font-bold">
              {style.icon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`${style.textColor} font-medium text-sm mb-1`}>
              {notification.type === 'success' && 'Your success message'}
              {notification.type === 'info' && 'Your information message'}
              {notification.type === 'warning' && 'Your warning message'}
              {notification.type === 'error' && 'Your error message'}
            </h3>
            <p className={`${style.textColor} text-sm opacity-80`}>
              {notification.message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${style.textColor} ml-3 flex-shrink-0 hover:opacity-70 transition-opacity`}
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
