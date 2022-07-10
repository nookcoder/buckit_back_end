import { S3 } from 'aws-sdk';
import { S3Response } from '../dto/s3-response.dto';

export async function uploadContentImages(
  projectUuid: string,
  files: Array<Express.Multer.File>
) {
  let index = 0;
  const contentUrl = [];
  for (const element of files) {
    await uploadToS3(
      element.buffer,
      `${process.env.AWS_BUCKET_NAME}/content`,
      `${index++}${projectUuid}.${getImageType(element.originalname)}`
    ).then((response: S3Response) => {
      contentUrl.push(response.Location);
    });
  }

  return contentUrl;
}

export async function uploadThumbnailImage(
  projectUuid: string,
  file: Express.Multer.File
) {
  let thumbnailS3Url = '';
  const imageType = getImageType(file.originalname);
  const thumbnailBuffer: Buffer = file.buffer;
  await uploadToS3(
    thumbnailBuffer,
    `${process.env.AWS_BUCKET_NAME}/thumbnail`,
    `${projectUuid}.${imageType}`
  ).then((response: S3Response) => {
    thumbnailS3Url = response.Location;
  });

  return thumbnailS3Url;
}

function getImageType(originalName: string) {
  const splitOriginalName = originalName.toString().split('.');
  return splitOriginalName[splitOriginalName.length - 1];
}

async function uploadToS3(file, bucketName, originName) {
  const s3 = getS3();
  const params = {
    Bucket: bucketName,
    Key: String(originName),
    Body: file,
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data: S3Response) => {
      if (err) {
        reject(err.message);
      }
      resolve(data);
    });
  });
}

function getS3() {
  return new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
}
