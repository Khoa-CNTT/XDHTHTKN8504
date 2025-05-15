import axios from "axios";

async function uploadImageToCloudinary(
  imageUri: string
): Promise<string | null> {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg", // Thay nếu ảnh khác định dạng
    name: "upload.jpg",
  } as any);
  data.append("upload_preset", "YOUR_UPLOAD_PRESET"); // Thay bằng upload preset của bạn

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // res.data.secure_url là URL ảnh upload thành công
    return res.data.secure_url;
  } catch (error) {
    console.error("Upload ảnh lỗi:", error);
    return null;
  }
}
