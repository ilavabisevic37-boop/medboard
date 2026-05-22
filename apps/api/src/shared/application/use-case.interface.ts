/**
 * Single-method contract for an Application use case (interactor).
 * Keeps Application layer free from framework details.
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
