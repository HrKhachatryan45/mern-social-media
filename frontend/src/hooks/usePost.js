import {useState} from "react";
import {toast} from "react-toastify";
const usePost = () =>{
    const [loading, setLoading] = useState(false);
    const post = async (formData) =>{
        setLoading(true);
        try {
            const success  = handleInputs(formData)
            if(success) return ;
            const response = await fetch('/api/profile/post',{
                method:'POST',
                body:formData
            })
            const json = await response.json()
            if (json.error){
                toast.error(json.error)
            }

            if (response.ok){
                toast.success('Post successfully shared')
            }

            console.log(response,'response')
            console.log(json,'newPost')
        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }finally {
            setLoading(false)
        }
    }
    return {post,loading}

}


const handleInputs = (formData) => {
    const content = formData.get('content');
    if (!content) {
        toast.error('No details provided');
        return true;
    }
    return false;
}
export default usePost;