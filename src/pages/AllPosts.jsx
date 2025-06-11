import { useCallback, useEffect, useRef, useState } from "react";
import { getAllActivePost } from "../services/blog.js";
import { Container, PostCard } from "../components/index.js";
import { useSelector } from "react-redux";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const refList = useRef([])

  const loadMoreData = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    getAllActivePost(6, page)
      .then((result) => {
        if (result.success) {
          setPosts((prev) => [...prev, ...result.data.blogs]);
          setPage((prev) => prev + 1);
          setHasMore(result.data.hasMore);
        } else {
          setError(result.message);
        }
      })
      .finally(() => setLoading(false));
  }, [page, posts.length]);

  useEffect(() => {
    if (!authStatus) return;
    if (posts.length === 0) {
      loadMoreData();
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target);
        loadMoreData()
      }
    });
    const lastElement = refList.current.at(-1);
    observer.observe(lastElement);

    return () => {
      observer.disconnect();
    };
  }, [authStatus, posts.length]);

  if (error) {
    return (
      <div className="w-full min-h-[70vh] py-8 flex justify-center items-center">
        <h2 className="text-red-600 text-2xl font-semibold">{error}</h2>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[70vh] py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post, index) => {
            return (
              <div className="p-2 w-1/2" key={post._id} ref={(el) => refList.current[index] = el}>
                <PostCard
                  title={post.title}
                  id={post._id}
                  image_url={post.image}
                  owner={post.owner}
                />
              </div>
            );
          })}
          {!!loading && (
            <h2 className="text-gray-950 font-semibold text-2xl text-center mb-2 mt-2">
              Loading... Please wait!
            </h2>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
