import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrantService } from './grant.service';
import { Grant } from './grant.entity';
import { GrantResolver } from './grant.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Grant])],
  providers: [GrantService, GrantResolver],
})
export class GrantModule {}
