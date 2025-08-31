import { CategoryDTO } from './ICategory';

export interface DishDTO {
  id: number;
  nombre: string;
  precio: number;
  cateogoriaid: number;
  categoriaDTO: CategoryDTO;
}
