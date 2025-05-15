import {Body, Controller, Delete, Get, Param, Post, Query, UseInterceptors, UseGuards, Req} from '@nestjs/common'
import {CreateProjectDto} from "./dtos/project.dto"
import {ProjectsService} from "../services/projects.service"
import {InjectMapper} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Project} from "../models/project.model"
import {ProjectResponseDto} from "./dtos/projectResponse.dto"
import {CreatePageDto} from "./dtos/page.dto"
import {CreateDesignDto} from "./dtos/design.dto"
import {Design} from "../models/design.model"
import {Page} from "../models/page.model"
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface'

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private projectsService: ProjectsService,
    ) {}

    @Get()
    async getAllByAuthor(@Req() req: RequestWithUser): Promise<ProjectResponseDto[]> {
        const username = req.user.username;
        const projects = await this.projectsService.getAllByAuthor(username);
        return projects.map((project) =>
            this.mapper.map(project, Project, ProjectResponseDto)
        );
    }

    @Post()
    async createProject(@Body() projectDto: CreateProjectDto, @Req() req: RequestWithUser) : Promise<ProjectResponseDto> {
        let project = this.mapper.map(projectDto, CreateProjectDto, Project);
        const createdProject = await this.projectsService.createProject(project, req.user.username);
        return this.mapper.map(createdProject, Project, ProjectResponseDto);
    }

    @Delete('/:name')
    async deleteProject(@Param('name') name: string, @Req() req: RequestWithUser): Promise<void> {
        const username = req.user.username;
        await this.projectsService.deleteProject(username, name);
    }

    @Post('/:projectName/snapshots/update-all')
    async updateAllSnapshots(
        @Param('projectName') projectName: string,
        @Query('exportDesigns') exportDesigns: boolean,
        @Req() req: RequestWithUser 
    ): Promise<any> {
        await this.projectsService.updateAllSnapshots(projectName, exportDesigns, req.user.username);
    }

    @Post('/:projectName')
    async addPage(
        @Param('projectName') projectName: string, 
        @Body() {pageUrl, ...pageDto}: CreatePageDto, 
        @Req() req: RequestWithUser 
    ) : Promise<any> {
        const pageToAdd: Page = {designs: {}, ...pageDto};
        await this.projectsService.addPage(projectName, pageUrl, pageToAdd, req.user.username);
    }

    @Delete('/:projectName/:pageUrl')
    async deletePage(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Req() req: RequestWithUser
    ): Promise<void> {
        const username = req.user.username;
        await this.projectsService.deletePage(username, projectName, pageUrl);
    }

    @Post('/:projectName/:pageUrl')
    async addDesign(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Body() designDto: CreateDesignDto,
        @Req() req: RequestWithUser 
    ) : Promise<any> {
        const designToAdd = this.mapper.map(designDto, CreateDesignDto, Design);
        const createdPage = await this.projectsService.addDesign(projectName, pageUrl, designDto.name, designToAdd, req.user.username);
        return createdPage;
    }

    @Delete('/:projectName/:pageUrl/:designName')
    async deleteDesign(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Param('designName') designName: string,
        @Req() req: RequestWithUser
    ): Promise<void> {
        const username = req.user.username;
        await this.projectsService.deleteDesign(username, projectName, pageUrl, designName);
    }

    @Post('/:projectName/:pageUrl/:designName/make-screenshot')
    async makePageScreenshot(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Param('designName') designName: string,
        @Req() req: RequestWithUser 
    ) : Promise<any> {
        await this.projectsService.makePageScreenshot(projectName, pageUrl, designName, req.user.username);
    }

    @Post('/:projectName/:pageUrl/:designName/export-design-screenshot')
    async exportDesignScreenshot(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Param('designName') designName: string,
        @Req() req: RequestWithUser 
    ) : Promise<any> {
        await this.projectsService.exportDesignScreenshot(projectName, pageUrl, designName, req.user.username);
    }

    @Post('/:projectName/:pageUrl/:designName/compare-screenshots')
    async compareScreenshots(
        @Param('projectName') projectName: string,
        @Param('pageUrl') pageUrl: string,
        @Param('designName') designName: string,
        @Req() req: RequestWithUser 
    ) : Promise<any> {
        await this.projectsService.compareScreenshots(projectName, pageUrl, designName, req.user.username);
    }
}
