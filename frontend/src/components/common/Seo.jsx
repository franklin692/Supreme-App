import { useEffect } from "react";

const upsertMeta = (key, value, attr = "name") => {
  if (value == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

export const Seo = ({ title, description, image }) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) upsertMeta("description", description);
    if (title) upsertMeta("og:title", title, "property");
    if (description) upsertMeta("og:description", description, "property");
    if (image) upsertMeta("og:image", image, "property");
  }, [title, description, image]);
  return null;
};
