import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async getOrCreateCategory(name: string) {
    const categoryName = await this.categoryRepository.findOne({
      where: { name: name },
    });

    if (!categoryName) {
      return await this.categoryRepository.save(
        this.categoryRepository.create({ name })
      );
    }

    return categoryName;
  }
}
