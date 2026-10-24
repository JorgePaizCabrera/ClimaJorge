/** Caché en memoria con tiempo de expiración, para no saturar la API externa. */
export class CacheTTL<T> {
  private datos = new Map<string, { valor: T; expira: number }>();

  constructor(private ttlMs: number) {}

  obtener(clave: string): T | undefined {
    const item = this.datos.get(clave);
    if (!item) return undefined;
    if (Date.now() > item.expira) {
      this.datos.delete(clave);
      return undefined;
    }
    return item.valor;
  }

  guardar(clave: string, valor: T) {
    this.datos.set(clave, { valor, expira: Date.now() + this.ttlMs });
  }
}
