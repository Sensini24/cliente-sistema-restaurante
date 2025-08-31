export interface StateItemResponse {
  value: boolean;
  mensaje: string;
}

export interface OrderDetailDTO {
  id: number;
  cantidad: number;
  nombre: string;
  subTotal: number;
}
