import useGetAllPosts from "../../hooks/useGetAllPosts";
import {usePostContext} from "../../context/usePostContext";
import AnotherProfileAppearance from "./AnotherProfileAppearance";
import EachPost from "../posts/EachPost";

function MyPostCenter({authUser2}) {
    const { loading } = useGetAllPosts(); // Fetch posts using the hook
    const { allPosts } = usePostContext(); // Consume posts from context

    const myPosts = allPosts.filter(post => post.userId._id.toString() ===authUser2._id.toString())
    return (
        <div className={'xl:w-[50%] lg:w-[47%] md:w-[68%] sm:w-[64%] w-[60%] h-full xl:px-3 lg:px-3 md:px-3 sm:px-1 px-[5px] pt-2  overflow-auto'}>

                <AnotherProfileAppearance authUser2={authUser2}/>
                {loading ? <span className={'loading loading-spinner'}></span> : myPosts.map((item) => {
                    const date = new Date(item.schedule);
                    const options = {year: 'numeric', month: 'long', day: 'numeric'};
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    return (
                        <EachPost key={item._id} formattedDate={formattedDate} item={item}/>
                    )
                })}
        </div>
    );
}

export default MyPostCenter;