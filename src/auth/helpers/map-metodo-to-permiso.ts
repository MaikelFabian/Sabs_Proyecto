export function mapMetodoToPermiso(metodo: string): string {
    switch (metodo.toUpperCase()) {
        case 'GET':
            return 'ver';
        case 'POST':
            return 'crear';
        case 'PUT':
        case 'PATCH':
            return 'editar';
        case 'DELETE':
            return 'eliminar';
        default:
            return '';
    }
}