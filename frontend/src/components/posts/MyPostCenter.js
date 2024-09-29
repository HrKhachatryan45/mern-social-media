import useGetAllPosts from "../../hooks/useGetAllPosts";
import {usePostContext} from "../../context/usePostContext";
import PostShare from "./PostShare";
import EachPost from "./EachPost";
import {useAuthContext} from "../../context/useAuthContext";
import ProfileAppearance from "../profileSide/ProfileAppearance";

function MyPostCenter(props) {
    const { loading } = useGetAllPosts(); // Fetch posts using the hook
    const { allPosts } = usePostContext(); // Consume posts from context
    const {authUser} = useAuthContext()

    const myPosts = allPosts.filter(post => post.userId._id.toString() ===authUser._id.toString())
    return (
        <div className={'xl:w-[50%] lg:w-[47%] md:w-[68%] sm:w-[64%] w-[60%] h-full xl:px-3 lg:px-3 md:px-2 sm:px-2 px-1 pt-2  overflow-auto'}>
            <ProfileAppearance isInSettings={true}/>
            <PostShare className1={'inp1'}  className2={'inp2'}/>
            <div className={'w-full h-fit flex flex-col justify-start items-center'}>
                {loading ? <span className={'loading loading-spinner'}></span> : myPosts.map((item) => {
                    const date = new Date(item.schedule);
                    const options = {year: 'numeric', month: 'long', day: 'numeric'};
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    return (
                        <EachPost key={item._id} formattedDate={formattedDate} item={item}/>
                    )
                })}
            </div>
        </div>
    );
}

export default MyPostCenter;