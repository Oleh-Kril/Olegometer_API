import {Body, Controller, Delete, Get, Param, Post, Query, UseInterceptors} from '@nestjs/common'
import {FileStorageService} from "../services/file-storage.service"

@Controller('file-storage')
export class FileStorageController {
    private userEmail: string = "mayorford777@gmail.com";

    constructor(
        private fileStorageService: FileStorageService,
    ) {}

    @Get()
    async getFile(@Query('key') key: string): Promise<string> {
        if (!key) {
            throw new Error('Key is required to get file');
        }

        const fileBuffer = await this.fileStorageService.getFile(key);

        return fileBuffer.toString('base64');
    }
}
