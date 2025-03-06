import {ForbiddenException, Injectable, NotFoundException, UseInterceptors} from '@nestjs/common'
import {ProjectsRepository} from "../repositories/projects.repository"
import {InjectMapper} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Project} from "../models/project.model"
import {Design} from "../models/design.model"
import {RenderingService} from "../../rendering/services/rendering.service"
import {IntegrationService} from "../../integration/services/integration.service"
import sizeOf from 'image-size'
import getCurrentTimeString from "../../../utils/dateUtils"
import {FileStorageService} from "../../file-storage/services/file-storage.service"
import {HttpService} from "@nestjs/axios"
import {Page} from "../models/page.model"

@Injectable()
export class ProjectsService {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private readonly projectsRepository: ProjectsRepository,
        private readonly renderingService: RenderingService,
        private readonly integrationService: IntegrationService,
        private readonly fileStorageService: FileStorageService,
        private readonly httpService: HttpService
    ) {}

    async createProject(project: Project) {
        const projectFromDb = await this.projectsRepository.projects.getAllByFilter(
            {
                name: project.name,
                author: project.author
            });

        if(projectFromDb.length !== 0){
            throw new ForbiddenException("Project with the same name already exists")
        }

        const createdProject = await this.projectsRepository.projects.create(project);

        return createdProject;
    }

    async getAllByAuthor(userEmail: string) {
        const projects = await this.projectsRepository.projects.getAllByFilter({author: userEmail});

        return projects;
    }

    async deleteProject(userEmail, name: string) {
        const projects = await this.projectsRepository.projects.getAllByFilter({name: name, author: userEmail});

        if (projects.length !== 1) {
            throw new NotFoundException("Project not found for the user")
        }

        if(Object.keys(projects[0].pages || {}).length !== 0){
            throw new ForbiddenException("Can't delete project with pages")
        }

        await this.projectsRepository.projects.delete(projects[0]._id.toString());
    }

    private async getProjectByName(projectName: string){
        const projectFromDb = await this.projectsRepository.projects.getByName(projectName);

        if(!projectFromDb){
            throw new NotFoundException("Project with the name doesn't exists")
        }

        return projectFromDb;
    }

    async addPage(projectName: string, pageUrl: string, pageToAdd: Page) {
        const projectFromDb =  await this.getProjectByName(projectName);

        projectFromDb.pages[pageUrl] = pageToAdd;

        await this.projectsRepository.projects.update(
            projectFromDb._id.toString(),
            projectFromDb
        );

        return projectFromDb.pages[pageUrl];
    }

    async deletePage(userEmail: string, projectName: string, pageUrl: string) {
        const project =  await this.getProjectByName(projectName);

        if (!project.pages || !project.pages[pageUrl]) {
            throw new NotFoundException("Page not found in the project");
        }

        delete project.pages[pageUrl];

        await this.projectsRepository.projects.update(project._id.toString(), project);
    }


    async addDesign(projectName: string, pageUrl: string, designName: string, designToAdd: Design) {
        const projectFromDb = await this.getProjectByName(projectName);

        const pageFromDb = projectFromDb.pages[pageUrl];

        if(!pageFromDb){
            throw new NotFoundException("Page not found")
        }

        if(pageFromDb.designs[designName]){
            throw new ForbiddenException("Design with the same name already exists")
        }

        designToAdd = await this.manageDesignScreenshotExport(projectFromDb, pageUrl, designToAdd);

        projectFromDb.pages[pageUrl].designs[designName] = designToAdd;

        await this.projectsRepository.projects.update(
            projectFromDb._id.toString(),
            projectFromDb
        );

        return projectFromDb.pages[pageUrl].designs[designName];
    }

    async deleteDesign(userEmail: string, projectName: string, pageUrl: string, designName: string): Promise<void> {
        const project = await this.getProjectByName(projectName);

        if (!project.pages || !project.pages[pageUrl]) {
            throw new NotFoundException("Page not found in the project");
        }

        const page = project.pages[pageUrl];
        if (!page.designs || !page.designs[designName]) {
            throw new NotFoundException("Design not found on the page");
        }

        const design = page.designs[designName];
        if(design.dynamicElements && Object.keys(design.dynamicElements).length !== 0){
            throw new ForbiddenException("Can't delete design with dynamic elements")
        }

        if(design.designSnapshotUrl){
            await this.fileStorageService.deleteFile(design.designSnapshotUrl);
        }
        if(design.websiteSnapshotUrl){
            await this.fileStorageService.deleteFile(design.websiteSnapshotUrl);
        }

        delete page.designs[designName];

        await this.projectsRepository.projects.update(project._id.toString(), project);
    }

    async makePageScreenshot(projectName: string, pageUrl: string, designName: string) {
        const projectFromDb = await this.getProjectByName(projectName);

        const pageFromDb = projectFromDb.pages[pageUrl];

        if(!pageFromDb){
            throw new NotFoundException("Page not found")
        }

        const designFromDb = pageFromDb.designs[designName];

        if(!designFromDb){
            throw new NotFoundException("Design not found")
        }

        await this.updatePageSnapshot(projectFromDb, pageUrl, designFromDb);

        await this.projectsRepository.projects.update(
            projectFromDb._id.toString(),
            projectFromDb
        );

        return designFromDb;
    }

    private async updatePageSnapshot(project: Project, pageUrl: string, design: Design) {
        const page = project.pages[pageUrl];
        const authInfo = !page.avoidAuth && Object.keys(project.users ?? {}).length !== 0 ? Object.values(project.users)[0] : undefined;
        const pageScreenshotBuffer = await this.renderingService.renderPage(project.domainUrl + pageUrl, design.width, authInfo, project.loginPage);

        const key = `${project.author}:/${project.name}:${pageUrl}:/${design.width}:page`
        design.websiteSnapshotUrl = key

        await this.fileStorageService.uploadFile(key, pageScreenshotBuffer);
        design.websiteSnapshotLastUpdated = getCurrentTimeString();

        return design;
    }

    async exportDesignScreenshot(projectName: string, pageUrl: string, designName: string) {
        const projectFromDb = await this.getProjectByName(projectName);

        const pageFromDb = projectFromDb.pages[pageUrl];

        if(!pageFromDb){
            throw new NotFoundException("Page not found")
        }

        const designFromDb = pageFromDb.designs[designName];

        if(!designFromDb){
            throw new NotFoundException("Design not found")
        }

        const updatedDesign = await this.manageDesignScreenshotExport(projectFromDb, pageUrl, designFromDb);

        projectFromDb.pages[pageUrl].designs[designName] = updatedDesign;

        await this.projectsRepository.projects.update(
            projectFromDb._id.toString(),
            projectFromDb
        );

        return projectFromDb.pages[pageUrl].designs[designName];
    }

    private async manageDesignScreenshotExport(project: Project, pageUrl: string, design: Design) {
        const designImageBuffer = await this.integrationService.exportFigmaImage(design.designUrl, project.figmaToken);

        const dimensions = sizeOf(designImageBuffer)
        const { width } = dimensions
        design.width = width || 1900

        const key = `${project.author}:/${project.name}:${pageUrl}:/${width}:design`
        design.designSnapshotUrl = key

        await this.fileStorageService.uploadFile(key, designImageBuffer);
        design.designSnapshotLastUpdated = getCurrentTimeString();

        return design;
    }

    async compareScreenshots(projectName: string, pageUrl: string, designName: string) {
        const projectFromDb = await this.getProjectByName(projectName);

        const pageFromDb = projectFromDb.pages[pageUrl];

        if(!pageFromDb){
            throw new NotFoundException("Page not found")
        }

        const designFromDb = pageFromDb.designs[designName];

        if(!designFromDb){
            throw new NotFoundException("Design not found");
        }

        const designScreenshotUrl = designFromDb.designSnapshotUrl;
        const websiteScreenshotUrl = designFromDb.websiteSnapshotUrl;

        if(!designScreenshotUrl || !websiteScreenshotUrl){
            throw new NotFoundException("Some of the screenshots are missing");
        }

        const comparisonResponse = await this.httpService.post(`http://localhost:${process.env.AI_API_PORT ?? 8000}/api/compare/`, {
            designS3Key: designScreenshotUrl,
            websiteS3Key: websiteScreenshotUrl
        }).toPromise();

        const comparisonResult = comparisonResponse.data;

        designFromDb.comparisonResult = comparisonResult;
        designFromDb.comparisonLastUpdated = getCurrentTimeString();

        await this.projectsRepository.projects.update(
            projectFromDb._id.toString(),
            projectFromDb
        );

        return comparisonResult;
    }

    async updateAllSnapshots(projectName: string, exportDesigns: boolean): Promise<Project> {
        const projectFromDb = await this.getProjectByName(projectName);

        if (!projectFromDb) {
            throw new NotFoundException("Project not found");
        }

        const promises: Promise<Design>[] = [];

        Object.entries(projectFromDb.pages).forEach(([pageUrl, page]) => {
            Object.entries(page.designs).forEach(([designName, design]) => {
                const promiseForPageSnapshot = this.updatePageSnapshot(projectFromDb, pageUrl, design);
                promises.push(promiseForPageSnapshot);

                if (exportDesigns) {
                    const promiseForDesignSnapshot = this.manageDesignScreenshotExport(projectFromDb, pageUrl, design)
                    promises.push(promiseForDesignSnapshot);
                }
            });
        });

        await Promise.all(promises);

        await this.projectsRepository.projects.update(
            projectFromDb._id.toString(),
            projectFromDb
        );

        return projectFromDb;
    }
}
