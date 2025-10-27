import slugify from "slugify";

slugify.extend({ 
  đ: "d", 
  Đ: "d" 
});

export const slugifyVN = (text) => 
  slugify(text, { lower: true, strict: true, locale: "vi" });

export default slugifyVN;
