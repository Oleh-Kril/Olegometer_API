import {Injectable, OnApplicationBootstrap} from '@nestjs/common'
import {MongoGenericRepository} from "../../../core/abstracts/mongo-generic-repository"
import {InjectModel} from "@nestjs/mongoose"
import {Model} from "mongoose"
import {Project, ProjectDocument} from "../models/project.model"

@Injectable()
export class ProjectsRepository implements OnApplicationBootstrap{
    projects: MongoGenericRepository<Project>;

    constructor(
        @InjectModel(Project.name)
        private ProjectRepository: Model<ProjectDocument>,
    ) {}

    onApplicationBootstrap() {
        this.projects = new MongoGenericRepository<Project>(this.ProjectRepository);
    }
}
