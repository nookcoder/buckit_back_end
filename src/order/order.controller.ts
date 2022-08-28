import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { OrderService } from './order.service';

@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}
