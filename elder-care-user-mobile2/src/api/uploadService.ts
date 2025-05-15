import API from "../utils/api"

export async function uploadAvatar(uri: string): Promise<string> {
  const filename = uri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: filename,
    type,
  } as any);

  try {
    const response = await API.post(
      "/auth/uploads",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.url;
  } catch (error: any) {
    // Có thể tùy biến thêm xử lý lỗi
    throw new Error(error.response?.data?.message || "Upload failed");
  }
}
