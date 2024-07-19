import {Body, Controller, Delete, Get, Param, Post, Query, UseInterceptors} from '@nestjs/common'
import {CreateProjectDto} from "./dtos/project.dto"
import {ProjectsService} from "../services/projects.service"
import {InjectMapper} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Project} from "../models/project.model"
import {ProjectResponseDto} from "./dtos/projectResponse.dto"
import {CreatePageDto} from "./dtos/page.dto"
import {CreateDesignDto} from "./dtos/design.dto"
import {Design} from "../models/design.model"

@Controller('projects')
export class ProjectsController {
    private userEmail: string = "mayorford777@gmail.com";

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private projectsService: ProjectsService,
    ) {}

    @Get()
    async getAllByAuthor(): Promise<any[]> {
        const userEmail = this.getUserEmailFromToken("");

        const projects = await this.projectsService.getAllByAuthor(userEmail);

        const mappedProjects: ProjectResponseDto[] = projects.map((project) =>
            this.mapper.map(project, Project, ProjectResponseDto)
        );

        return mappedProjects;
    }

    @Post()
    async createProject(@Body() projectDto: CreateProjectDto) : Promise<any> {
        const project = this.mapper.map(projectDto, CreateProjectDto, Project);

        const createdProject = await this.projectsService.createProject(project);

        return createdProject;
    }

    @Delete('/:name')
    async deleteProject(@Param('name') name: string): Promise<void> {
        const userEmail = this.getUserEmailFromToken("");

        await this.projectsService.deleteProject(userEmail, name);
    }

    private getUserEmailFromToken(userToken: string): string {
        return this.userEmail;
    }

    @Post('/:projectName/snapshots/update-all')
    async updateAllSnapshots(
        @Param('projectName') projectName: string,
        @Query('exportDesigns') exportDesigns: boolean,
    ): Promise<any> {
        return await this.projectsService.updateAllSnapshots(projectName, exportDesigns);
    }

    @Post('/:projectName')
    async addPage(@Param('projectName') projectName: string, @Body() {pageUrl}: CreatePageDto) : Promise<any> {
        await this.projectsService.addPage(projectName, pageUrl);
    }

    @Delete('/:projectName/:pageUrl')
    async deletePage(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
    ): Promise<void> {
        const userEmail = this.getUserEmailFromToken("");

        await this.projectsService.deletePage(userEmail, projectName, pageUrl);
    }

    @Post('/:projectName/:pageUrl')
    async addDesign(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Body() designDto: CreateDesignDto
    ) : Promise<any> {
        const designToAdd = this.mapper.map(designDto, CreateDesignDto, Design);

        const createdPage = await this.projectsService.addDesign(projectName, pageUrl, designDto.name, designToAdd);

        return createdPage;
    }

    @Delete('/:projectName/:pageUrl/:designName')
    async deleteDesign(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Param('designName') designName: string,
    ): Promise<void> {
        const userEmail = this.getUserEmailFromToken("");

        await this.projectsService.deleteDesign(userEmail, projectName, pageUrl, designName);
    }

    @Post('/:projectName/:pageUrl/:designName/make-screenshot')
    async makePageScreenshot(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Param('designName') designName: string,
    ) : Promise<any> {
        await this.projectsService.makePageScreenshot(projectName, pageUrl, designName);
    }

    @Post('/:projectName/:pageUrl/:designName/export-design-screenshot')
    async exportDesignScreenshot(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Param('designName') designName: string,
    ) : Promise<any> {
        await this.projectsService.exportDesignScreenshot(projectName, pageUrl, designName);
    }

    @Post('/:projectName/:pageUrl/:designName/compare-screenshots')
    async compareScreenshots(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Param('designName') designName: string,
    ) : Promise<any> {
        await this.projectsService.compareScreenshots(projectName, pageUrl, designName);
    }
}
