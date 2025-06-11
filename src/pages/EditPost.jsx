import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost } from "../services/blog.js";
import { Container, PostForm } from "../components/index.js";
import { useSelector } from "react-redux";

function EditPost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && authStatus) {
      setError("");
      setLoading(true);
      getPost(id)
        .then((result) => {
          if (result.success) {
            setPost(result.data);
          } else {
            setError(result.message);
            setTimeout(() => {
              navigate("/");
            }, 5000);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  if (error) {
    return (
      <div className="w-full min-h-[70vh] py-8 flex justify-center items-center">
        <h2 className="text-red-600 text-2xl font-semibold">{error}</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] py-8 flex justify-center items-center">
        <h2 className="text-gray-950 font-semibold text-2xl">
          Loading... Please wait!
        </h2>
      </div>
    );
  }

  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
