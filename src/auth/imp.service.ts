import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IMPService {
  constructor(private readonly httpService: HttpService) {}

  async getUserInfoFromImp(imp_uid: string) {
    try {
      const getToken = await this.httpService.axiosRef.post(
        'https://api.iamport.kr/users/getToken',
        {
          imp_key: process.env.IMP_REST_API_KEY, // REST API키
          imp_secret: process.env.IMP_REST_SECRET_KEY,
        }
      );
      const { access_token } = getToken.data.response;

      const getCertifications = await this.httpService.axiosRef.get(
        `https://api.iamport.kr/certifications/${imp_uid}`,
        {
          headers: {
            Authorization: access_token,
          },
        }
      );

      const certificationsInfo = getCertifications.data.response;
      const { birthday, gender, name } = certificationsInfo;
      return {
        birthday: birthday,
        gender: gender,
        name: name,
      };
    } catch (e) {
      console.error(e);
    }
  }
}
