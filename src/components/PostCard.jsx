import { Link } from "react-router-dom";

function PostCard({ title, id, image_url, owner }) {
  return (
    <Link to={`/post/${id}`}>
      <div className="w-full bg-gray-200 rounded-xl p-4">
        <div className="mb-3 flex justify-between items-center">
          <img
            src={owner.avatar}
            className="inline-block w-[50px] h-[50px] rounded-3xl object-cover"
          />
          <p className="font-semibold text-base">{owner.fullname}</p>
        </div>
        <div className="w-full mb-2">
          <img
            src={image_url}
            alt={title}
            className="rounded-xl h-[200px] w-[400px] object-cover"
          />
        </div>
        <h2 className="text-xl font-bold truncate pl-2">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
