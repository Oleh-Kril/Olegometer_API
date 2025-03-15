import {Injectable, OnModuleDestroy} from '@nestjs/common'
import {InjectMapper} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Browser, chromium, Page} from 'playwright'
import {InitAction, ProjectInitActions} from "../../projects/models/project.model"

@Injectable()
export class RenderingService implements OnModuleDestroy{
    private browser: Browser;

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async onModuleInit() {
        try {
            this.browser = await chromium.launch({headless: true});
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
        initActions?: ProjectInitActions[],
        auth?: {login: string, password: string},
        loginPage?: string,
    ) {
        const page = await this.browser.newPage()
        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        });

        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        } catch (error) {
            console.error(`Navigation to ${url} timed out after 30000ms. Continuing execution...`, error);
        }

        await page.setViewportSize({ width, height: 1080 })

        await this.autoScroll(page)

        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        if (delay) {
            await page.waitForTimeout(delay)
        }

        if (initActions && initActions.length) {
            for (const action of initActions) {
                if (action.action === InitAction.CLICK) {
                    try {
                        let locator;
                        if (action.className) {
                            // Convert space-separated class names to a proper CSS selector.
                            const classes = action.className
                                .split(' ')
                                .filter(Boolean)
                                .map(cls => `.${cls}`)
                                .join('');
                            // Use the locator with hasText filter to ensure both class and text match.
                            locator = page.locator(classes, { hasText: action.text });
                        } else {
                            locator = page.locator(`text=${action.text}`);
                        }
                        await locator.click({ timeout: 3000 });
                        await page.waitForTimeout(1500);
                    } catch (error) {
                        console.log(
                            `Could not click element with text "${action.text}" and class "${action.className}":`,
                            error
                        );
                    }
                }
            }
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
