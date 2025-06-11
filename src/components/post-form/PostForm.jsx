import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input, Button, Select, RTE } from "../index.js";
import { useCallback, useEffect, useState } from "react";
import {createPost, updatePost} from "../../services/blog.js"

function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null)

  const onSubmit = async (data) => {
     const formData = new FormData()
     formData.append("title", data.title)
     formData.append("slug", data.slug)
     formData.append("content", data.content)
     formData.append("status", data.status)

     if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    if(post){
        const result = await updatePost(formData, post._id) 
        if(result.success){
           navigate(`/post/${result.data._id}`)
        }else{
          setError(result.message)
        }
    }else{
        const response = await createPost(formData)
        if(response.success){
          navigate(`/post/${response.data._id}`)
        }else{
           setError(response.message)
        }
    }

     reset()

  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-") // this replaces special characters with hyphen
        .replace(/\s/g, "-"); // it replaces the spaces into hyphen

    return "";
  }, []);

  useEffect(() => {
    const subscribe = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title));
      }
    });

    return () => subscribe.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap">
      {!!error && <p className="text-center text-lg w-full text-red-500 mb-2">{error}</p>}
      <div className="w-2/3 px-2">
        <Input
          label="Title: "
          placeholder="Title"
          className="mb-4"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title length not less than 3 characters",
            },
            maxLength: {
              value: 60,
              message: "Title length must not exceed 60 characters",
            },
          })}
        />
        {!!errors.title && (
          <p className="text-red-500 mb-2">{errors.title.message}</p>
        )}
        <Input
          label="Slug: "
          placeholder="Slug"
          className="mb-4"
          {...register("slug", {
            required: "Slug is required",
            minLength: {
              value: 3,
              message: "Slug length not less than 3 characters",
            },
            maxLength: {
              value: 70,
              message: "Slug length must not exceed 70 characters",
            },
          })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value));
          }}
        />
        {!!errors.slug && (
          <p className="text-red-500 mb-2">{errors.slug.message}</p>
        )}
        <RTE label="Content: " name="content" control={control} />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image: "
          type="file"
          className="mb-4"
          accept="image/png image/jpg image/jpeg image/gif"
          {...register("image", {
            required: post ? false : "Image is required"
          })}
        />
        {!!errors.image && (
          <p className="text-red-500 mb-2">{errors.image.message}</p>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status: "
          className="mb-4"
          {...register("status", {
            required: "Status is required",
          })}
        />
        {!!errors.status && (
          <p className="text-red-500 mb-2">{errors.status.message}</p>
        )}
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full disabled:opacity-50"
          disabled={isSubmitting}
        >
          { post
            ? isSubmitting
              ? "Updating"
              : "Update"
            : isSubmitting
            ? "Submitting"
            : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
