import { useCallback, useEffect, useRef } from "react";
import { getMyAllPosts } from "../services/blog.js";
import { Container, PostCard } from "../components/index.js";
import { useState } from "react";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const refList = useRef([]);
  const [hasMore, setHasMore] = useState(true);

  const loadData = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    getMyAllPosts(6, page)
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
      loadData();
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target);
        loadData();
      }
    });
    const lastElement = refList.current.at(-1);
    observer.observe(lastElement);

    return () => {
      observer.disconnect();
    };
  }, [posts.length, authStatus]);

  if (error) {
    return (
      <div className="w-full min-h-[70vh] py-8 flex justify-center items-center">
        <h2 className="text-red-600 text-2xl font-semibold">{error}</h2>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex justify-center items-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500 text-center">
                {authStatus ? "Create your post" : "Login to read posts"}
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[70vh] py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post, index) => {
            return (
              <div
                className="p-2 w-1/2"
                key={post._id}
                ref={(el) => (refList.current[index] = el)}
              >
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
            <p className="text-gray-950 font-semibold text-2xl text-center">
              Loading... Please wait!
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Home;
