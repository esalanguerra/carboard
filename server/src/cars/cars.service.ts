import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class CarsService {
  private apiUrl = "http://localhost:8000/carros"

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<[]>(this.apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Cars An error happened!';
        }),
      )
    )

    return data;
  }

  findOne(id: string) {
    return `This action returns a #${id} car`;
  }
}
