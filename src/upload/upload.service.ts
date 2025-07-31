import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'posts',
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result)
              return reject(
                error instanceof Error ? error : new Error('Upload failed'),
              );
            resolve({ url: result.secure_url });
          },
        );

        Readable.from(file.buffer).pipe(uploadStream);
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Image upload failed');
      throw new BadRequestException(error.message);
    }
  }
}
