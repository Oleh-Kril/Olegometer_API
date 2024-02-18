import {Injectable, OnModuleDestroy} from '@nestjs/common'
import {InjectMapper} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Browser, chromium} from 'playwright'

@Injectable()
export class RenderingService implements OnModuleDestroy{
    private browser: Browser;

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
    ) {
        chromium.launch().then((browser) => {
            this.browser = browser
        })
    }

    async onModuleDestroy() {
        await this.browser.close();
    }

    async renderPage(url: string, width: number) {
        const page = await this.browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle' })

        await page.waitForLoadState('networkidle')

        await page.setViewportSize({ width, height: 1080 })
        const imageBuffer = await page.screenshot({ type: 'jpeg', fullPage: true })
        await page.close()

        return imageBuffer
    }
}
