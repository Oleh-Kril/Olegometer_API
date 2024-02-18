import {Injectable} from "@nestjs/common"
import parseFigmaUrl from "../../../utils/parseFigmaUrl"
import {HttpService} from "@nestjs/axios"

@Injectable()
export class IntegrationService{
    constructor(private httpService: HttpService) {}

    async exportFigmaImage(url: string, token: string): Promise<Buffer>{
        const {fileKey, imageId} = parseFigmaUrl(url)

        if(!fileKey || !imageId){
            throw new Error('Invalid Figma URL')
        }

        const response = await this.httpService.get(`https://api.figma.com/v1/images/${fileKey}?ids=${imageId}&format=jpg`, {
            headers: {
                'X-FIGMA-TOKEN': token,
            },
        }).toPromise()

        const { images } = response.data

        const imageUrl = images[imageId.replace(/-/g, ':')]

        if(!imageUrl){
            throw new Error("Design isn't added. Please check Figma URL and try again")
        }

        const responseWithImage =  await this.httpService.get(imageUrl,{
            method: 'GET',
            responseType: 'arraybuffer',
        }).toPromise()

        return responseWithImage.data;
    }
}
