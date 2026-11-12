export const uploadImageToImgBB = async (imageFile) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ImgBB API key is missing! Please add NEXT_PUBLIC_IMGBB_API_KEY to .env.local"
    );
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message || "Failed to upload image to ImgBB.");
  }

  return data.data.display_url;
};