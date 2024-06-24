import { Column } from 'typeorm';
export class Application {
  @Column({ type: 'text' })
  description: string;
}
