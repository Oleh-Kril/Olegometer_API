import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';


describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectService: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  describe('project endpoints', () => {

  });
});
