import { labelToSlug } from "@/lib/helper-functions";
import { utapi } from "@/server/uploadthing";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTFile, UTFiles } from "uploadthing/server";

import { z } from "zod";

import sharp from "sharp";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "2MB",
      maxFileCount: 1,
      additionalProperties: {
        aspectRatio: 1,
        height: 1080,
        width: 1080,
      },
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files, input }) => {
      // This code runs on your server before upload
      const user = auth(req);

      // If you throw, the user will not be able to upload
      if (!user) new UploadThingError("UNAUTHORIZED");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      const fileOverrides = files.map((file) => {
        const slugifyName = labelToSlug(file.name);
        return { ...file, name: slugifyName };
      });

      const emptyImages: { key: string; url: string }[] = [];

      // Return userId to be used in onUploadComplete
      return {
        userId: user.id,
        [UTFiles]: fileOverrides,
        images: emptyImages,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const commonFileName = file.name.split(".")[0];
      const commonFileType = file.name.split(".")[1];

      // 1. Fetch the original image which is uploaded
      const responseImage = await fetch(file.url);

      // 2. Error check
      if (!responseImage.ok) new UploadThingError("Failed to fetch image");

      // 3. Create a buffer of the original image
      const bufferImage = await responseImage.arrayBuffer();

      // 4. Make mobile & tablet resized buffers using sharp
      const mobileBuffer = await sharp(bufferImage).resize(400, 400).toBuffer();
      const tabletBuffer = await sharp(bufferImage).resize(600, 600).toBuffer();

      // 5. Create uploadthing files using the buffers
      const mobileImage = new UTFile(
        [mobileBuffer],
        `${commonFileName}/mobile.${commonFileType}`,
      );
      const tabletImage = new UTFile(
        [tabletBuffer],
        `${commonFileName}/tablet.${commonFileType}`,
      );

      // 6. Upload the files
      const savedImages = await utapi.uploadFiles([mobileImage, tabletImage]);

      // 7. ::Check:: If the images were uploaded successfully
      if (!savedImages[0]?.data) {
        new UploadThingError("Failed to fetch image");
      }

      // 8. Create an array of the images with the fields that are to be used in the frontend
      const imagesArr: {
        key: string;
        url: string;
      }[] = [{ key: file.key, url: file.url }].concat(
        savedImages
          .map((obj) => {
            if (obj.data) {
              return {
                key: obj.data.key,
                url: obj.data.url,
              };
            }
          })
          .filter((obj) => obj !== undefined),
      );

      // 9. Return data to the frontend
      return {
        uploadedBy: metadata.userId,
        images: imagesArr,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
