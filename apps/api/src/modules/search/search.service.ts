import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  search(q: string) {
    return { q, results: [] };
  }
}


