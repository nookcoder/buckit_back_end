import { Body, Controller, Post } from '@nestjs/common';
import { ProfitService } from './profit.service';

@Controller('api/v1/profit')
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}
  /**
   * 특정 유저한테 포인트 제공 ( 휴대폰 번호, 이메일 주소)
   * @param pointsToBeAdded
   * @param phoneNumbers
   * ex { phoneNumbers : ["전화번호1", "전화번호2" ]}
   */
  // @Roles(UserRole.Admin)
  @Post('/users')
  async servePointsToUsers(
    @Body('points') pointsToBeAdded: number,
    @Body('phoneNumbers') phoneNumbers: string[]
  ) {
    return await this.profitService.servePointsToUsers(
      pointsToBeAdded,
      phoneNumbers
    );
  }
  // 프로젝트에 투자한 사람들에게 포인트 제공
}
