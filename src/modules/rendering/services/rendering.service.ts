import {Injectable, OnModuleDestroy} from '@nestjs/common'
import {InjectMapper} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Browser, chromium, Page} from 'playwright'

@Injectable()
export class RenderingService implements OnModuleDestroy{
    private browser: Browser;

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async onModuleInit() {
        try {
            this.browser = await chromium.launch({headless: false});
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

        await this.autoScroll(page)

        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        if (delay) {
            await page.waitForTimeout(delay)
        }

        const imageBuffer = await page.screenshot({ type: 'jpeg', fullPage: true })
        await page.close()

        return imageBuffer
    }

    private async autoScroll(page: Page) {
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= document.body.scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }
}
