import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Project } from '../project/entities/project.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDetail } from './dto/create-order-detail.dto';
import { CreateOrderOutput } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>
  ) {}

  async getProjectsBeforePayment(userId: number) {
    const orders = await this.orderRepository.find({
      where: {
        user: {
          id: userId,
        },
        status: OrderStatus.DepositWaiting,
      },
      relations: ['project', 'orderDetail'],
    });
  }

  async createOrder(
    userId: number,
    projectId: number,
    qty: number
  ): Promise<CreateOrderOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
      });

      // 구매하려는 Quarter 수와 구매할 수 있는 Quarter 수 비교
      const { success } = await this.updateSoldQuarterOfProject(project, qty);
      if (!success) {
        return {
          ok: false,
          error: 'There is no quantity available for purchase',
        };
      }

      const orderDetail: OrderDetail = await this.createOrderDetail(
        qty,
        project.pricePerQuarter
      );

      await this.saveOrder(user, project, orderDetail);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  async completePayment() {}

  async cancelPayment() {}

  async updateSoldQuarterOfProject(project: Project, qty: number) {
    if (
      project.totalQuarter < qty + project.soldQuarter ||
      project.totalQuarter < qty ||
      project.totalQuarter <= project.soldQuarter
    ) {
      return {
        success: false,
      };
    }

    await this.projectRepository.update(project.id, {
      soldQuarter: project.soldQuarter + qty,
    });

    return {
      success: true,
    };
  }

  async createOrderDetail(
    qty: number,
    pricePerQuarter: number
  ): Promise<OrderDetail> {
    const orderDetailDto: CreateOrderDetail = {
      qty,
      pricePerQuarter: pricePerQuarter,
      total: qty * pricePerQuarter,
    };

    return this.orderDetailRepository.save(
      this.orderDetailRepository.create(orderDetailDto)
    );
  }

  async saveOrder(
    user: User,
    project: Project,
    orderDetail: OrderDetail
  ): Promise<Order> {
    const order = await this.orderRepository.create();
    order.user = user;
    order.project = project;
    order.orderDetail = orderDetail;
    return await this.orderRepository.save(order);
  }
}
