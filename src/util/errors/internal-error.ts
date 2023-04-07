export class InternalError extends Error {
  // O code: 500 impede a propagação dos erros internos para o usuário

  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
