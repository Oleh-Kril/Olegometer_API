import {Injectable, OnModuleDestroy} from '@nestjs/common'
import {InjectMapper} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Browser, chromium} from 'playwright'

@Injectable()
export class RenderingService implements OnModuleDestroy{
    private browser: Browser;

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async onModuleInit() {
        try {
            this.browser = await chromium.launch();
        } catch (error) {
            console.error('Error launching browser:', error);
        }
    }

    async onModuleDestroy() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async renderPage(
        url: string,
        width: number,
        delay?: number,
        auth?: {login: string, password: string},
        loginPage?: string,
    ) {
        const page = await this.browser.newPage()
        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        });
        await page.goto(url, { waitUntil: 'networkidle' })

        await page.waitForLoadState('networkidle')

        await page.setViewportSize({ width, height: 1080 })
        if (delay) {
            await page.waitForTimeout(delay)
        }
        const imageBuffer = await page.screenshot({ type: 'jpeg', fullPage: true })
        await page.close()

        return imageBuffer
    }
}
