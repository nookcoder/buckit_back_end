import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../project/entities/project.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/create_order.dto';
import { Orders } from './entities/order.entity';
import {
  generateOrderCode,
  handleErrorOfProject,
} from '../common/utils/order-utils';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>
  ) {}

  private readonly logger = new Logger(OrderService.name);

  async createNewOrder(
    userId: number,
    { project_id, quarter_qty }: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    try {
      const project = await this.projectRepository.findOne({
        where: {
          id: project_id,
        },
        relations: ['orders', 'category'],
      });
      handleErrorOfProject(project, quarter_qty);

      const orderCode = generateOrderCode(project.category.name, quarter_qty);
      // 새로운 주문 생성
      const order = await this.orderRepository.save(
        this.orderRepository.create({
          user_id: userId,
          project_id: project_id,
          quarter_price: project.pricePerQuarter,
          quarter_qty: quarter_qty,
          order_code: orderCode,
        })
      );

      // 프로젝트 업데이트
      project.orders.push(order);
      project.soldQuarter += quarter_qty;
      await this.projectRepository.save(project);

      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['orders'],
      });
      // 유저 정보 업데이트
      user.orders.push(order);
      await this.userRepository.save(user);

      return {
        ok: true,
        order_code: orderCode,
      };
    } catch (err) {
      this.logger.error(`
       routes : '/new', 
       User Id = ${userId}, 
       Project Id = ${project_id},  
       ${err}`);

      return {
        ok: false,
        error: "Couldn't create the Order",
      };
    }
  }
}
