import {ForbiddenException, Injectable, NotFoundException, UseInterceptors} from '@nestjs/common'
import {ProjectsRepository} from "../repositories/projects.repository"
import {InjectMapper} from "@automapper/nestjs"
import {Mapper} from "@automapper/core"
import {Project} from "../models/project.model"

@Injectable()
export class ProjectsService {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private readonly projectsRepository: ProjectsRepository
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
}
