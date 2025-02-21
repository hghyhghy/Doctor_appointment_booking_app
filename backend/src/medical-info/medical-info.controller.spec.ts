import { Test, TestingModule } from '@nestjs/testing';
import { MedicalInfoController } from './medical-info.controller';

describe('MedicalInfoController', () => {
  let controller: MedicalInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalInfoController],
    }).compile();

    controller = module.get<MedicalInfoController>(MedicalInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
