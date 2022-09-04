import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Project } from '../project/entities/project.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/create_order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  async createOrder(
    userId: number,
    { project_id, quarter_qty }: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    try {
      const project = await this.projectRepository.findOne({
        where: {
          id: project_id,
        },
      });

      if (!project) {
        return {
          ok: false,
          error: `Not Found Project Where project_id = ${project_id}`,
        };
      }

      const quarterPrice = project.pricePerQuarter;

      const newOrder = this.orderRepository.create({
        user_id: userId,
        project_id: project_id,
        quarter_price: quarterPrice,
        quarter_qty: quarter_qty,
      });

      await this.orderRepository.save(newOrder);
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        error: err,
      };
    }
  }
}
