
export class Usuario {

  constructor(
    public nombre: string,
    public email: boolean,
    public password?: string,
    public img?: string,
    public google?: string,
    public role?: string,
    public uid?: string
  ) { }

}
