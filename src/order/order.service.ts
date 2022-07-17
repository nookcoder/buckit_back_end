import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Project } from '../project/entities/project.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDetail } from './dto/create-order-detail.dto';
import { CreateOrderOutput } from './dto/create-order.dto';
import { BeforePaymentProject } from './dto/before-payment-project.dto';
import { PaymentCompletedProject } from './dto/payment-completed-project.dto';

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

  async getProjectsBeforePayment(
    userId: number
  ): Promise<Array<BeforePaymentProject>> {
    const orders: Order[] = await this.orderRepository.find({
      where: {
        user: {
          id: userId,
        },
        status: OrderStatus.DepositWaiting,
      },
      relations: ['project', 'orderDetail'],
      order: {
        createdAt: 'ASC',
      },
    });
    const projectsBeforePayment: Array<BeforePaymentProject> = [];
    for (const order of orders) {
      const project: BeforePaymentProject = {
        orderId: order.id,
        projectId: order.projectId,
        orderNumber: order.orderNumber,
        address: order.project.address,
        deadline: order.project.deadline,
        orderCreatedAt: order.createdAt,
        soldQuarter: order.project.soldQuarter,
        thumbnailImageUrl: order.project.thumbnailImage,
        title: order.project.title,
        total: order.project.total,
        totalQuarter: order.project.totalQuarter,
      };
      projectsBeforePayment.push(project);
    }
    return projectsBeforePayment;
  }

  async getProjectsPaymentCompleted(
    userId: number
  ): Promise<Array<PaymentCompletedProject>> {
    const orders: Order[] = await this.orderRepository.find({
      where: {
        userId: userId,
        status: OrderStatus.PaymentCompleted,
      },
      relations: ['project', 'orderDetail'],
      order: {
        createdAt: 'DESC',
      },
    });
    const projectsPaymentCompleted: Array<PaymentCompletedProject> = [];
    for (const order of orders) {
      const project: PaymentCompletedProject = {
        address: order.project.address,
        deadline: order.project.deadline,
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderUpdatedAt: order.updatedAt,
        pricePerQuarter: order.project.pricePerQuarter,
        projectId: order.project.id,
        projectStatus: order.project.status,
        qty: order.orderDetail.qty,
        purchaseTotal: order.orderDetail.total,
        soldQuarter: order.project.soldQuarter,
        thumbnailImageUrl: order.project.thumbnailImage,
        title: order.project.title,
        total: order.project.total,
        totalQuarter: order.project.totalQuarter,
      };
      projectsPaymentCompleted.push(project);
    }

    return projectsPaymentCompleted;
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
