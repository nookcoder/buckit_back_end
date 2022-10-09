import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Project } from '../project/entities/project.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/create_order.dto';
import { Orders } from './entities/order.entity';
import {
  generateOrderCode,
  handleErrorOfProject,
} from '../common/utils/order-utils';
import { CancelOrderOutput } from './dto/cancel-order.dto';

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
    { project_id, quarter_qty, buyer_bank, buyer_name }: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    try {
      const project = await this.projectRepository.findOne({
        where: {
          id: project_id,
        },
        relations: ['orders', 'category'],
      });

      handleErrorOfProject(project, +quarter_qty);

      if (!userId) {
        return;
      }

      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['orders'],
      });

      const orderCode = generateOrderCode(project.category.name, +quarter_qty);
      const newOrder = this.orderRepository.create({
        user: user,
        project: project,
        quarter_price: project.pricePerQuarter,
        quarter_qty: +quarter_qty,
        order_code: orderCode,
        buyer_bank: buyer_bank,
        buyer_name: buyer_name,
      });

      // 프로젝트 업데이트
      project.orders.push(newOrder);
      project.soldQuarter += +quarter_qty;
      await this.projectRepository.save(project);

      // 유저 정보 업데이트
      user.orders.push(newOrder);
      await this.userRepository.save(user);

      await this.orderRepository.save(newOrder);
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

  async cancelOrder(
    userId: number,
    orderCode: string
  ): Promise<CancelOrderOutput> {
    try {
      const order = await this.orderRepository.findOne({
        where: {
          order_code: orderCode,
        },
      });

      if (order.user_id !== userId) {
        this.logger.error(
          `request user id = ${userId}, owner id = ${order.user_id}`
        );
        return {
          ok: false,
          error: "Don't have auth",
        };
      }

      const project = await this.projectRepository.findOne({
        where: {
          id: order.project_id,
        },
      });

      await this.projectRepository.update(project.id, {
        soldQuarter: project.soldQuarter - order.quarter_qty,
      });

      await this.orderRepository.delete(order.id);
      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        error: err,
      };
    }
  }

  async updateOrder(orderId: number, partialEntity: any) {
    await this.orderRepository.update(orderId, partialEntity);
    return;
  }

  async findOrderByOrderCode(orderCode: string): Promise<Orders | null> {
    const order = await this.orderRepository.findOne({
      where: {
        order_code: orderCode,
      },
      relations: ['project', 'user'],
    });

    if (!order) {
      this.logger.error(`
        message : Can't Find order (order_code = ${orderCode}
      `);
      return null;
    }

    return order;
  }
}
