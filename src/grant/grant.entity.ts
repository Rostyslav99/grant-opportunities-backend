import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum GrantStatus {
  APPLIED = 'APPLIED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

registerEnumType(GrantStatus, { name: 'GrantStatus' });

@ObjectType()
@Entity()
export class Grant {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  deadlineDate: Date;

  @Field()
  @Column()
  matchDate: Date;

  @Field()
  @Column('decimal')
  avgAmount: number;

  @Field()
  @Column()
  location: string;

  @Field()
  @Column()
  companyName: string;

  @Field(() => GrantStatus)
  @Column({ type: 'text', enum: GrantStatus, default: GrantStatus.APPLIED })
  status: GrantStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  feedback?: string;
}
