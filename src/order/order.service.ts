import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../project/entities/project.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/create_order.dto';
import { Orders } from './entities/order.entity';

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
        relations: ['orders'],
      });
      this.handleErrorOfProject(project, quarter_qty);

      // 새로운 주문 생성
      const order = await this.orderRepository.save(
        this.orderRepository.create({
          user_id: userId,
          project_id: project_id,
          quarter_price: project.pricePerQuarter,
          quarter_qty: quarter_qty,
        })
      );

      // 프로젝트 업데이트
      project.orders.push(order);
      project.totalQuarter -= quarter_qty;
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

  handleErrorOfProject(
    project: Project | undefined,
    quarterQty: number | null
  ): void | Error {
    if (!project) {
      throw new Error('Not Found This Project');
    } else if (project && project.status !== ProjectStatus.FUNDING_PROGRESS) {
      throw new Error("Can't Funding Now");
    } else if (project.totalQuarter < quarterQty) {
      throw new Error('Not Enough Block');
    } else {
      return;
    }
  }
}
