import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    create(createApplicationDto: CreateApplicationDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateApplicationDto: UpdateApplicationDto): string;
    remove(id: string): string;
}
