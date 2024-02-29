import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
export declare class DictService {
    create(createDictDto: CreateDictDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDictDto: UpdateDictDto): string;
    remove(id: number): string;
}
