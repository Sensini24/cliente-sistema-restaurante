export interface StateItemResponse {
  value: boolean;
  mensaje: string;
}

export interface OrderDetailDTO {
  id: number;
  cantidad: number;
  nombre: string;
  subTotal: number;
  nota: string;
}

export interface ItemCreateDTO {
  productoid: number;
  cantidad: number;
  notas: string;
}
