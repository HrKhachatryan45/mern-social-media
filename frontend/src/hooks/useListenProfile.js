import {useSocketContext} from "../context/useSocketContext";
import {useAuthContext} from "../context/useAuthContext";
import {useEffect} from "react";

const useListenProfile = () => {
    const {socket} = useSocketContext();
    const {authUser, setAuthUser} = useAuthContext();

    useEffect(() => {
        if (!socket) return;

        const handleUpdateUser = (updatedUser) => {
            console.log(updatedUser,'new updated user')
            if (updatedUser._id === authUser._id) {
                setAuthUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        };

        const handleUpdateFollow = ({ userId }) => {
            setAuthUser(prevAuthUser => {
                if (prevAuthUser._id === authUser._id) {
                    return {
                        ...prevAuthUser,
                        arrays: {
                            ...prevAuthUser.arrays,
                            followers: prevAuthUser.arrays.followers.filter(followerId => followerId !== userId),
                            followings: prevAuthUser.arrays.followings.filter(followingId => followingId !== userId),
                        }
                    };
                }
                return prevAuthUser;
            });
        };

        socket.on('updateUser', handleUpdateUser);
        socket.on('updateFollow', handleUpdateFollow);

        return () => {
            socket.off('updateUser', handleUpdateUser);
            socket.off('updateFollow', handleUpdateFollow);
        };
    }, [socket, authUser, setAuthUser]);

    return null; // This hook does not render anything
};

export default useListenProfile;
