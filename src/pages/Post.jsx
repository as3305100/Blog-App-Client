import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPost, deletePost } from "../services/blog.js";
import { Container, Button } from "../components/index.js";
import parse from "html-react-parser";

function Post() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userData = useSelector((state) => state.auth.userData);

  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (id && authStatus) {
      setError("")
      setLoading(true);
      getPost(id)
        .then((result) => {
          if (result.success) {
            setPost(result.data);
            setIsAuthor(userData._id === result.data.owner ? true : false);
          } else {
            setError(result.message)
            setTimeout(() => {
              navigate("/")
            }, 5000)
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const deleteBlog = useCallback(() => {
    setError("")
    deletePost(post._id).then((result) => {
      if (result?.success) {
        navigate("/");
      }else{
        setError(result.message)
      }
    });
  }, [post]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] py-8 flex justify-center items-center">
        <h2 className="text-gray-950 font-semibold text-2xl">
          Loading... Please wait!
        </h2>
      </div>
    );
  }

   if (error && !post) {
    return (
      <div className="w-full min-h-[70vh] py-8 flex justify-center items-center">
        <h2 className="text-red-600 text-2xl font-semibold">{error}</h2>
      </div>
    );
  }

  return post ? (
    <div className="py-8">
      <Container>
        {!!error && (
          <p className="text-center text-red-600 text-xl font-medium mb-2 mt-2">
            {error}
          </p>
        )}

        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img
            src={post.image}
            alt={post.title}
            className="rounded-xl w-3xl h-[800px] object-cover"
          />

          {!!isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit/${post._id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deleteBlog}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}

export default Post;
