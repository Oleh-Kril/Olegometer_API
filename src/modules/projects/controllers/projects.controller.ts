import {Body, Controller, Delete, Get, Param, Post, UseInterceptors} from '@nestjs/common'
import {CreateProjectDto} from "./dtos/project.dto"
import {ProjectsService} from "../services/projects.service"
import {InjectMapper, MapInterceptor} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Project} from "../models/project.model"
import {ProjectResponseDto} from "./dtos/projectResponse.dto"

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
}
