import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/cloudflare";
import { useRef, useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import InlineCode from "@editorjs/inline-code";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";

const BlogEditor = () => {
  let blogBannerRef = useRef();
  let blogTitleRef = useRef();
  let publishBtnRef = useRef();
  let saveDraftBtnRef = useRef();
  let editorJSInstance = useRef();

  const { userAuth: { access_token } } = useContext(UserContext);

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];

    if (img) {
      let loadingToast = toast.loading("Uploading image...");
      uploadImage(img)
        .then((url) => {
          if (url) {
            blogBannerRef.current.src = url;
            toast.dismiss(loadingToast);
            toast.success("Uploaded 👍");
          }
        })
        .catch((error) => {
          toast.dismiss(loadingToast);
          toast.error("Try uploading an image that's 500 KB or smaller.");
          console.error("Upload error:", error);
        });
    }
  };

  const handlePublish = () => {
    if (!blogTitleRef.current.value.length) {
          return toast.error("Write a blog title before publishing");
      }

      let loadingToast = toast.loading("Publishing your blog...");

      editorJSInstance.current.save().then((content) => {
          if (content.blocks.length) {
              let blogObj = {
                  title: blogTitleRef.current.value,
                  banner: blogBannerRef.current.src,
                  content,
                  tags: [],
                  des: "",
                  draft: false
              };

              publishBtnRef.current.classList.add("opacity-50");

              fetch(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${access_token}`
                  },
                  body: JSON.stringify(blogObj)
              })
              .then(p => p.json())
              .then(data => {
                  if (data.blog_id) {
                      toast.dismiss(loadingToast);
                      toast.success("Published 👍");
                      setTimeout(() => {
                          location.href = "/";
                      }, 500);
                  }
              })
              .catch(err => {
                  toast.dismiss(loadingToast);
                  toast.error("Error occurred while publishing");
                  publishBtnRef.current.classList.remove("opacity-50");
              });
          } else {
              toast.dismiss(loadingToast);
              toast.error("Write some content to publish the blog");
          }
      }).catch((err) => {
          toast.dismiss(loadingToast);
          toast.error("Error occurred while publishing");
      });
  };

  const handleSaveDraft = () => {
      if (!blogTitleRef.current.value.length) {
          return toast.error("Write a blog title before saving it as draft");
      }

      let loadingToast = toast.loading("Saving your blog...");

      editorJSInstance.current.save().then((content) => {
          let blogObj = {
              title: blogTitleRef.current.value,
              banner: blogBannerRef.current.src,
              content,
              tags: [],
              des: "",
              draft: true
          };

          saveDraftBtnRef.current.classList.add("opacity-50");

          fetch(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${access_token}`
              },
              body: JSON.stringify(blogObj)
          })
          .then(p => p.json())
          .then(data => {
              if (data.blog_id) {
                  toast.dismiss(loadingToast);
                  toast.success("Draft Saved 👍");
                  setTimeout(() => {
                      location.href = "/";
                  }, 500);
              }
          })
          .catch(err => {
              toast.dismiss(loadingToast);
              toast.error("Error occurred while saving draft");
              saveDraftBtnRef.current.classList.remove("opacity-50");
          });
      }).catch((err) => {
          toast.dismiss(loadingToast);
          toast.error("Error occurred while saving draft");
      });
  };

  useEffect(() => {
      if (!editorJSInstance.current) {
          editorJSInstance.current = new EditorJS({
              holder: "textEditor",
              placeholder: "Let's write an awesome story",
              tools: {
                  header: {
                      class: Header,
                      config: {
                          placeholder: "Heading"
                      }
                  },
                  list: {
                      class: List,
                      inlineToolbar: true,
                      config: {
                          defaultStyle: "unordered"
                      }
                  },
                  code: Code,
                  linkTool: {
                      class: LinkTool,
                      config: {
                          endpoint: import.meta.env.VITE_SERVER_DOMAIN + "/upload-image"
                      }
                  },
                  inlineCode: {
                      class: InlineCode,
                      shortcut: "CMD+SHIFT+M"
                  },
                  quote: {
                      class: Quote,
                      inlineToolbar: true
                  },
                  marker: {
                      class: Marker,
                      shortcut: "CMD+SHIFT+H"
                  },
                  image: {
                      class: Image,
                      config: {
                          endpoints: {
                              byFile: import.meta.env.VITE_SERVER_DOMAIN + "/upload-image",
                              byUrl: import.meta.env.VITE_SERVER_DOMAIN + "/upload-image"
                          }
                      }
                  },
                  embed: {
                      class: Embed,
                      config: {
                          services: {
                              youtube: true,
                              coub: true
                          }
                      }
                  }
              }
          });
      }
  }, []);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>

        <div className="flex gap-4 ml-auto">
          <button ref={publishBtnRef} className="btn-dark py-2" onClick={handlePublish}>Publish</button>
          <button ref={saveDraftBtnRef} className="btn-light py-2" onClick={handleSaveDraft}>Save Draft</button>
        </div>
      </nav>

      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  ref={blogBannerRef}
                  src={defaultBanner}
                  className="z-20 w-full h-full object-cover"
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              ref={blogTitleRef}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:text-black/30"
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
