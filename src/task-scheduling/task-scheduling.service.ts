import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Project, ProjectStatus } from '../project/entities/project.entity';

@Injectable()
export class TaskSchedulingService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  // @Cron('* * */3 * * *')
  // async handleExpiredOrders() {
  //   const orders = await this.orderRepository.find({
  //     where: [{ status: OrderStatus.DepositWaiting }],
  //     relations: ['orderDetail', 'project'],
  //   });
  //   const now = moment(Date.now());
  //   for (const order of orders) {
  //     const updatedAt = moment(order.updatedAt);
  //     if (moment.duration(now.diff(updatedAt)).asHours() >= 3) {
  //       console.log(`Delete ${order.orderDetail} from ${order.project.title}`);
  //       await this.projectRepository.update(order.projectId, {
  //         soldQuarter: order.project.soldQuarter - order.orderDetail.qty,
  //       });
  //       await this.orderRepository.delete(order.id);
  //     }
  //   }
  // }

  // todo : 3달이상 지난 알림 지우기

  // todo : 입금 완료 시 확인 완료 로직 추가 (금액이 맞는 지, 입금자명, 은행이 일치하는 지 확인할 것)
}
