export interface PaginatedResponse<T> {
    content: T[]; // Array de elementos de tipo T
    pageable: {
      pageNumber: number; // Número de página actual
      pageSize: number; // Tamaño de la página
      sort: {
        empty: boolean; // Indica si el orden está vacío
        sorted: boolean; // Indica si está ordenado
        unsorted: boolean; // Indica si no está ordenado
      };
      offset: number; // Offset de la página
      paged: boolean; // Indica si es paginado
      unpaged: boolean; // Indica si no es paginado
    };
    size: number; // Tamaño total de la página
    number: number; // Número de la página actual
    sort: {
      empty: boolean; // Indica si el orden está vacío
      sorted: boolean; // Indica si está ordenado
      unsorted: boolean; // Indica si no está ordenado
    };
    first: boolean; // Indica si es la primera página
    last: boolean; // Indica si es la última página
    numberOfElements: number; // Número de elementos en la página actual
    empty: boolean; // Indica si no hay elementos
  }
  