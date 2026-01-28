import { UploadedFile } from "express-fileupload";
import fs from 'fs'
import path from "path";
import { Uuuid } from "../../config";
import { CustomError } from "../../domain";



export class FileUploadService {
  constructor(
    private readonly uuuid = Uuuid.v4,
  ) {}

  private checkFolder( folderPath: string ) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['png','jpg','jpeg','gif'],
  ) {

    try {
      const fileExtension = file.mimetype.split('/').at(1) ?? '';
      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(`Invalid extension: ${fileExtension}, valid ones ${validExtensions}`);
      }
      const destination = path.resolve(__dirname, '../../../', folder);
      this.checkFolder(destination);

      const filename = `${this.uuuid()}.${fileExtension}`;

      file.mv(`${destination}/${filename}`);
      return { filename };
    } catch (error) {
      throw error;
    }
      
  }

  uploadMultiple(
    file: any[],
    folder: string = 'uploads',
    validExtensions: string[] = ['png','jpg','jpeg','gif'],
  ) {}
}
