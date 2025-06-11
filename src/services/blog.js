import axios from "axios";

function handleAxiosError(
  error,
  fallbackMessage = "Network error or server not responding"
) {
  return (
    error?.response?.data || {
      success: false,
      message: fallbackMessage,
    }
  );
}

async function createPost(data){
   try {
     const response = await axios.post("https://blog-app-server-2f1h.onrender.com/api/v1/blogs/blog", data, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
       withCredentials: true
     })

     if(response?.data?.success){
         return response.data
     }

     return {
        success: false,
        message: "Unknown Error while creating a blog"
     }

   } catch (error) {
     return handleAxiosError(error)
   }
}

async function updatePost(data, blogId){
    try {
        const response = await axios.patch(`https://blog-app-server-2f1h.onrender.com/api/v1/blogs/update-blog/${blogId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        })
    
        if(response?.data?.success){
            return response.data
        }
    
        return {
            success: false,
            message: "Unknown error occurred while updating the blog"
        }
    } catch (error) {
        return handleAxiosError(error)
    }
}

async function getMyAllPosts(limit=6, page=1){

   console.log("Limit: ", limit)

  try {
     const response = await axios.get(`https://blog-app-server-2f1h.onrender.com/api/v1/blogs/my-blogs?limit=${limit}&page=${page}`, {
       withCredentials: true
     })

     if(response?.data?.success){
        return response.data
     }

     return {
       success: false,
       message: "Unknown error occurred while fetching all posts"
     }

  } catch (error) {
      return handleAxiosError(error)
  }
}

async function getPost(id){
   try {
      const response = await axios.get(`https://blog-app-server-2f1h.onrender.com/api/v1/blogs/blog/${id}`, {
        withCredentials: true
      })

      if(response?.data?.success){
        return response.data
      }

      return {
        success: false,
        message: "Unknown error occurred while getting a blog"
      }

   } catch (error) {
       return handleAxiosError(error)
   }
}

async function getAllActivePost(limit=10, page=1){

   try {
      const response = await axios.get(`https://blog-app-server-2f1h.onrender.com/api/v1/blogs/active-blogs?limit=${limit}&page=${page}`, {
        withCredentials: true
      })

      if(response?.data?.success){
        return response.data
      }

      return {
        success: false,
        message: "Unknown error occurred while fetching active blogs"
      }
   } catch (error) {
      return handleAxiosError(error)
   }
}

async function deletePost(id){
   try {
     const response = await axios.delete(`https://blog-app-server-2f1h.onrender.com/api/v1/blogs/blog/${id}`, {
      withCredentials: true
     })

     if(response?.data?.success){
       return response.data
     }

     return {
        success: false,
        message: "Unknown error occured while deleting the blog"
     }

   } catch (error) {
      return handleAxiosError(error)
   }
}

export {createPost, updatePost, getAllActivePost, getMyAllPosts, getPost, deletePost}
