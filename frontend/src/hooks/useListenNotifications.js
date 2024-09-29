import { useEffect } from "react";
import { useSocketContext } from "../context/useSocketContext";
import { useAuthContext } from "../context/useAuthContext";

const useListenNotifications = () => {
    const { socket } = useSocketContext();
    const { setAuthUser, authUser } = useAuthContext();

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification) => {
            notification.shouldShake = true;

            setAuthUser((prevAuthUser) => {
                const notifications = prevAuthUser.notifications || [];
                const filteredNotifications = notifications.filter(
                    (existingNotification) => existingNotification._id !== notification._id
                );

                const updatedNotifications = [...filteredNotifications, notification];

                localStorage.setItem('user', JSON.stringify({
                    ...prevAuthUser,
                    notifications: updatedNotifications,
                }));

                return {
                    ...prevAuthUser,
                    notifications: updatedNotifications,
                };
            });

            console.log(notification, 'notification');
        };

        socket?.on('userUpdate', (updatedUser) => {
            setAuthUser((prevUser) => ({
                ...prevUser,
                isRead: updatedUser.isRead,
            }));

            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('new Notification updated user', updatedUser);
        });

        socket?.on('newNotification', handleNewNotification);

        return () => {
            socket.off('newNotification');
            socket.off('userUpdate');
        };
    }, [socket, setAuthUser]);

    return null;
};

export default useListenNotifications;
