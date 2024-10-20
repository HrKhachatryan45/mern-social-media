const suggestPeopleYouMayKnow = (currentUser, allUsers) => {
    // Set to store suggested user IDs to avoid duplicates
    const suggestedUserIds = [];

    // Get the list of users that the current user is following
    const myFollowings = currentUser.arrays.followings || [];
    const myFollowers = currentUser.arrays.followers || [];
    // For each user that the current user is following
    myFollowings.forEach(followingUser => {
        // For each follower of the following user
        followingUser.arrays.followers.forEach(followerId => {
            // Add the follower to the suggested users set if it's not the current user
            // and if the current user is not already following them
            if (followerId.toString() !== currentUser._id.toString() &&    !myFollowings.some(f => f._id.toString() === followerId.toString()) &&  !myFollowers.some(f => f._id.toString() === followerId.toString())){
                suggestedUserIds.push(followerId.toString());
            }
        });
    });

    // Convert the set of suggested user IDs to an array of user objects
    let  suggestedUsers = allUsers.filter(user => suggestedUserIds.includes(user._id.toString()) && user.isDeleted === false);

    if (suggestedUsers.length === 0) {
        suggestedUsers = allUsers.filter((user)=>user._id.toString() !== currentUser._id.toString() &&  user.isDeleted === false)
    }


    return suggestedUsers;
};

module.exports = { suggestPeopleYouMayKnow };
