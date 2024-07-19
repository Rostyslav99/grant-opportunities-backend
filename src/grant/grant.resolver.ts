import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { GrantService } from './grant.service';
import { Grant, GrantStatus } from './grant.entity';

@Resolver(() => Grant)
export class GrantResolver {
  constructor(private readonly grantService: GrantService) {}

  /**
   * Retrieve all grants from the database.
   * @returns Promise<Grant[]> List of grants.
   */
  @Query(() => [Grant])
  getAllGrants(): Promise<Grant[]> {
    return this.grantService.findAll();
  }

  /**
   * Retrieve new grant opportunities from the database.
   * @returns Promise<Grant[]> List of new grant opportunities.
   */
  @Query(() => [Grant])
  getNewOpportunities(): Promise<Grant[]> {
    return this.grantService.findNewOpportunities();
  }

  /**
   * Accept a grant with the specified ID.
   * @param id ID of the grant to accept.
   * @param feedback Optional feedback for accepting the grant.
   * @returns Promise<Grant> Accepted grant object.
   */
  @Mutation(() => Grant)
  likeGrant(
    @Args('id', { type: () => ID }) id: number,
    @Args('feedback', { type: () => String, nullable: true }) feedback?: string,
  ): Promise<Grant> {
    return this.grantService.updateGrantStatus(
      id,
      GrantStatus.ACCEPTED,
      feedback,
    );
  }

  /**
   * Reject a grant with the specified ID.
   * @param id ID of the grant to reject.
   * @param feedback Optional feedback for rejecting the grant.
   * @returns Promise<Grant> Rejected grant object.
   */
  @Mutation(() => Grant)
  dislikeGrant(
    @Args('id', { type: () => ID }) id: number,
    @Args('feedback', { type: () => String, nullable: true }) feedback?: string,
  ): Promise<Grant> {
    return this.grantService.updateGrantStatus(
      id,
      GrantStatus.REJECTED,
      feedback,
    );
  }
}
