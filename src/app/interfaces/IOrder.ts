export interface OrdersWIDTO {
  id: number;
  fechahora: Date;
  estado: string;
  usuarioid: number;
  mesaid: number;
  total: number;
  itempedidos: ItemsPedidoDTO[];
}

export interface ItemsPedidoDTO {
  id: number;
  productoid: number;
  nombreProducto: string;
  cantidad: number;
  preciounitario: number;
  notas: string;
  estado: string;
}

export interface StateOrderResponse {
  value: boolean;
  mensaje: string;
}
