import {
  Controller,
  ParseFilePipe,
  UseInterceptors,
  Post,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('image')
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(file);
  }
}
