/** */
export const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

    export async function getAlbumImages(albumId) {
      // 1. List all album files from collections path
      let images = import.meta.glob<{ default: ImageMetadata }>(
        "/src/content/albums/**/*.{jpeg,jpg}"
      );
    
      // 2. Filter images by albumId
      images = Object.fromEntries(
        Object.entries(images).filter(([key]) => key.includes(albumId))
      );
    
      // 3. Images are promises, so we need to resolve the glob promises
      const resolvedImages = await Promise.all(
        Object.values(images).map((image) => image().then((mod) => mod.default))
      );
    
      // 4. Shuffle images with random order
      resolvedImages.sort(() => Math.random() - 0.5);
    
      return resolvedImages;
    }
    