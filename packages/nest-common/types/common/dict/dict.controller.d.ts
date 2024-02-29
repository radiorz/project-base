import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
export declare class DictController {
    private readonly dictService;
    constructor(dictService: DictService);
    create(createDictDto: CreateDictDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDictDto: UpdateDictDto): string;
    remove(id: string): string;
}
//# sourceMappingURL=dict.controller.d.ts.map