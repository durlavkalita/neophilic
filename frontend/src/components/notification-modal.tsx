import React, { useEffect, useState } from "react";

interface NotificationModalProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoCloseTime?: number;
}

export function NotificationModal({
  message,
  isVisible,
  onClose,
  autoCloseTime = 5000,
}: NotificationModalProps) {
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    if (isVisible) {
      const intervalTime = 50;
      const decrementAmount = (100 / autoCloseTime) * intervalTime;
      const timer = setInterval(() => {
        setProgress((prev: number) => {
          if (prev - decrementAmount <= 0) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - decrementAmount;
        });
      }, intervalTime);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoCloseTime]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <p>{message}</p>
        <div
          className="h-1 bg-green-500 mt-4 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
