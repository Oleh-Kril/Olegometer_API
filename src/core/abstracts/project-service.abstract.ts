import {IGenericRepository} from "./generic-repository.abstract"
import {Project} from "../../modules/projects/models/project.model"

export abstract class IProjectService {
  abstract projects: IGenericRepository<Project>;
}
