import useGetAllPosts from "../../hooks/useGetAllPosts";
import {usePostContext} from "../../context/usePostContext";
import PostShare from "./PostShare";
import EachPost from "./EachPost";

function PostCenter(props) {
    const { loading } = useGetAllPosts(); // Fetch posts using the hook
    const { allPosts } = usePostContext(); // Consume posts from context
    return (
        <div className={'xl:w-[50%] lg:w-[50%] md:w-[68%] sm:w-[64%] w-[60%] h-full xl:px-3 lg:px-3 md:px-2 sm:px-1 px-1 pt-4  overflow-auto'}>
            <PostShare className1={'inp1'} className2={'inp2'}/>
            <div className={'w-full h-fit flex flex-col justify-start items-center'}>
                {loading ? <span className={'loading loading-spinner'}></span> : allPosts.map((item) => {
                    const date = new Date(item.schedule);
                    const options = {year: 'numeric', month: 'long', day: 'numeric'};
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    return (
                       <EachPost key={item._id} formattedDate={formattedDate}  item={item}/>
                    )
                })}
            </div>
        </div>
    );
}

export default PostCenter;