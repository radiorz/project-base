import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationService {
    create(createApplicationDto: CreateApplicationDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateApplicationDto: UpdateApplicationDto): string;
    remove(id: number): string;
}
