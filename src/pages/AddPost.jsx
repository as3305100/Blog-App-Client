import { Container, PostForm } from "../components/index.js";

function AddPost() {
  return (
     <div className="w-full min-h-[70vh] py-10">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
